import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.utils import secure_filename
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key'

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'purple123'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/shop')
def shop():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM products')
    products = c.fetchall()
    conn.close()
    return render_template('shop.html', products=products)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM products WHERE id = ?', (product_id,))
    product = c.fetchone()
    conn.close()
    return render_template('product.html', product=product)

@app.route('/add_to_cart/<int:product_id>', methods=['POST'])
def add_to_cart(product_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, price, image FROM products WHERE id=?", (product_id,))
    product = cursor.fetchone()
    conn.close()

    if product:
        cart = session.get('cart', [])
        for item in cart:
            if item['id'] == product[0]:
                item['quantity'] += 1
                break
        else:
            cart.append({
                'id': product[0],
                'name': product[1],
                'description': product[2],
                'price': float(product[3]),
                'image': product[4],
                'quantity': 1
            })

        session['cart'] = cart
        session.modified = True

    return redirect(url_for('view_cart'))


@app.route('/cart')
def view_cart():
    cart_items = session.get('cart', [])
    for item in cart_items:
        item.setdefault('quantity', 1)
        item.setdefault('price', 0)
        item.setdefault('name', '')
        item.setdefault('description', '')
        item.setdefault('image', '')
    cart_count = sum(item['quantity'] for item in cart_items)
    return render_template('cart.html', cart_items=cart_items, cart_count=cart_count)

@app.route('/update_cart/<int:product_id>', methods=['POST'])
def update_cart(product_id):
    quantity = int(request.form['quantity'])
    cart = session.get('cart', [])
    for item in cart:
        if item['id'] == product_id:
            if quantity <= 0:
                cart.remove(item)
            else:
                item['quantity'] = quantity
            break
    session['cart'] = cart
    session.modified = True
    return redirect(url_for('view_cart'))

@app.route('/clear_cart')
def clear_cart():
    session.pop('cart', None)
    flash('Cart cleared.')
    return redirect(url_for('shop'))

@app.route('/checkout')
def checkout():
    return render_template('checkout.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        if request.form['username'] == ADMIN_USERNAME and request.form['password'] == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect(url_for('admin_upload'))
        else:
            flash("Invalid credentials.")
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin/upload', methods=['GET', 'POST'])
def admin_upload():
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        desc = request.form['desc']
        file = request.files['image']
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            conn = sqlite3.connect('database.db')
            c = conn.cursor()
            c.execute("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
                      (name, price, desc, filename))
            conn.commit()
            conn.close()
            flash("Product uploaded.")
            return redirect(url_for('admin_upload'))

    return render_template('admin_upload.html')

if __name__ == '__main__':
    app.run(debug=True)
