import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { startGetAllCategory } from '../../actions/category_actions';
import { startGetAllSubCategory } from '../../actions/subCategory_actions';
import { startUpdateProduct } from '../../actions/product_actios';



// Validation schema using Yup
const validationSchema = Yup.object({
    productName: Yup.string().required('Product Name is required'),
    category: Yup.string().required('Category is required'),
    subcategory: Yup.string().required('Subcategory is required'),
    image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 10000000)) // Limit file size to 10MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
    status: Yup.string().required('Status is required'),
});

const Edit_product = ({ handleClose, data }) => {
    console.log(data);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(startGetAllCategory());
        dispatch(startGetAllSubCategory());
    }, [dispatch]);

    const category = useSelector((state) => state.category.data);
    const subCategory = useSelector((state) => state.subCategory.data);

    const formik = useFormik({
        initialValues: {
            productName: data?.productName || '',
            category: data?.categoryId || '',
            subcategory: data?.subCategoryId || '',
            image: data?.image || null,
            status: data?.status ? "Active":"Inactive",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            // Handle form submission, including updating the product
            const formData = new FormData();
            formData.append('productName', values.productName);
            formData.append('category', values.category);
            formData.append('subcategory', values.subcategory);
            if (values.image instanceof File) {
                formData.append('image', values.image);
            }
            formData.append('status', values.status == 'Active' ? true : false)

            dispatch(startUpdateProduct(data._id, formData, handleClose, resetForm));
        },
    });

    const handleFileChange = (e) => {
        formik.setFieldValue('image', e.target.files[0]);
    };
    useEffect(() => {
        if (data?.image) {
            formik.setFieldValue('image', data.image);
        }
    }, [data?.image])
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
                <label htmlFor="productName" className="form-label">Product Name:</label>
                <input
                    id="productName"
                    name="productName"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('productName')}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.productName && formik.errors.productName ? (
                    <div className="text-danger">{formik.errors.productName}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="category" className="form-label">Category:</label>
                <select
                    id="category"
                    name="category"
                    className="form-control"
                    {...formik.getFieldProps('category')}
                    onBlur={formik.handleBlur}
                >
                    <option value="" label="Select category" />
                    {category.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.category}
                        </option>
                    ))}
                </select>
                {formik.touched.category && formik.errors.category ? (
                    <div className="text-danger">{formik.errors.category}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="subcategory" className="form-label">Subcategory:</label>
                <select
                    id="subcategory"
                    name="subcategory"
                    className="form-control"
                    {...formik.getFieldProps('subcategory')}
                    onBlur={formik.handleBlur}
                >
                    <option value="" label="Select subcategory" />
                    {subCategory.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subCategory}
                        </option>
                    ))}
                </select>
                {formik.touched.subcategory && formik.errors.subcategory ? (
                    <div className="text-danger">{formik.errors.subcategory}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="image" className="form-label">Image:</label>
                {formik.values.image && (
                    <div className="mb-3">
                        <img
                            src={`http://localhost:3096/${formik.values.image}`}
                            alt="product"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                    </div>
                )}
                <input
                    id="image"
                    name="image"
                    type="file"
                    className="form-control"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.image && formik.errors.image ? (
                    <div className="text-danger">{formik.errors.image}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="status" className="form-label">Status:</label>
                <select
                    id="status"
                    name="status"
                    className="form-control"
                    {...formik.getFieldProps('status')}
                    onBlur={formik.handleBlur}
                >
                    <option value="Active" label="Active" />
                    <option value="Inactive" label="Inactive" />
                </select>
                {formik.touched.status && formik.errors.status ? (
                    <div className="text-danger">{formik.errors.status}</div>
                ) : null}
            </div>

            <button type="submit" className="btn btn-primary">Update Product</button>
        </form>
    );
};

export default Edit_product;
