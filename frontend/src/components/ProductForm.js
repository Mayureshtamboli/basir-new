import React, { useState } from 'react';
import axios from 'axios';


const ProductForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        mobileNumber: '',
        productName: '',
        dateOfPurchase: '',
        address: '',
        pinCode: '',
        city: '',
        state: '',
        itemNumber: '',
        purchasedFrom: '',
        invoice: null,
        reviewScreenshot: null
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        // If it's a file input, update the state with the selected file
        const newValue = type === 'file' ? files[0] : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
        if (file.size > maxSize) {
            alert('File size exceeds 5MB limit.');
            return;
        }
    
        setFormData({ ...formData, [name]: file });
    };
    

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            await axios.post('/contact', formDataToSend);
            alert(`${formData.customerName}, your details has been successfully submited! 🎉 We'll get back to you as soon as possible. Thank you for reaching out!`);
            setFormData({
                customerName: '',
                email: '',
                mobileNumber: '',
                productName: '',
                dateOfPurchase: '',
                address: '',
                pinCode: '',
                city: '',
                state: '',
                itemNumber: '',
                purchasedFrom: '',
                invoice: null,
                reviewScreenshot: null
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message.');
        }
    }

    return (
        <div>
            <div className="banner">
  <a href="/registration" className="banner-link">Services</a>
</div>
        <div className="product-form-container">
            

            <h2>Product Registration</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="customerName">Your Name:</label>
                    <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                {/* Additional form fields similar to the ones already implemented */}
                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfPurchase">Date of Purchase:</label>
                    <input type="date" id="dateOfPurchase" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="pinCode">Pin Code:</label>
                    <input type="text" id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State/Province/Region:</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="itemNumber">Item Number:</label>
                    <input type="text" id="itemNumber" name="itemNumber" value={formData.itemNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="purchasedFrom">Purchased from:</label>
                    <input type="text" id="purchasedFrom" name="purchasedFrom" value={formData.purchasedFrom} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="invoice">Upload Invoice/Proof of Purchase:</label>
                    <input type="file" id="invoice" name="invoice" accept=".pdf, .jpg, .jpeg" onChange={handleFileChange} required />
                    <div style={{ fontSize: '20px' }}>Upload Image (Limit: 5MB)</div>
                    <div>Allowed file types: pdf,jpg,jpeg</div>
                </div>
                <div className="form-group">
                    <label htmlFor="reviewScreenshot">Upload Review Screenshot:</label>

                    <input type="file" id="reviewScreenshot" name="reviewScreenshot" accept=".jpg, .jpeg" onChange={handleFileChange} required />
                    <div style={{ fontSize: '20px' }}>Upload Here (Limit: 5MB)</div>
                    <div>Please provide screenshot documents. Allowed file types: jpg,jpeg</div>
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default ProductForm;
