import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { startUpdateCategory } from '../../actions/category_actions';

// Validation schema using Yup
const validationSchema = Yup.object({
    category: Yup.string().required('Category is required'),
    categorySequence: Yup.number()
        .typeError('Category Sequence must be a number')
        .required('Category Sequence is required')
        .min(1, 'Category Sequence must be at least 1'),
    image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 10000000)) // Limit file size to 10MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
    status: Yup.string().required('Status is required'),
});

const Edit_category = ({ handleClose, data }) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            category: data?.category || '',
            categorySequence: data?.categorySequence || '',
            image: data?.image || null,
            status: data?.status ? "Active" : "Inactive",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            // Handle form submission, including updating the product
            const formData = new FormData();
            formData.append('category', values.category);
            formData.append('categorySequence', values.categorySequence);
            if (values.image instanceof File) {
                formData.append('image', values.image);
            }
            formData.append('status', values.status === 'Active' ? true : false);

            dispatch(startUpdateCategory(data._id, formData, handleClose, resetForm));
        },
    });

    const handleFileChange = (e) => {
        formik.setFieldValue('image', e.target.files[0]);
    };

    useEffect(() => {
        if (data?.image) {
            formik.setFieldValue('image', data.image);
        }
    }, [data?.image]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Category Name:</label>
                <input
                    id="category"
                    name="category"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('category')}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.category && formik.errors.category ? (
                    <div className="text-danger">{formik.errors.category}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="categorySequence" className="form-label">Category Sequence:</label>
                <input
                    id="categorySequence"
                    name="categorySequence"
                    type="number"
                    className="form-control"
                    {...formik.getFieldProps('categorySequence')}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.categorySequence && formik.errors.categorySequence ? (
                    <div className="text-danger">{formik.errors.categorySequence}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="image" className="form-label">Image:</label>
                {formik.values.image && (
                    <div className="mb-3">
                        <img
                            src={`http://localhost:3096/${formik.values.image}`}
                            alt="category"
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

            <button type="submit" className="btn btn-primary">Update Category</button>
        </form>
    );
};

export default Edit_category;
