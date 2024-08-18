import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { startGetAllCategory } from '../../actions/category_actions'
import { startUpdateProduct } from '../../actions/product_actios'
import { startUpdateSubCategory } from '../../actions/subCategory_actions'

// Validation schema using Yup
const validationSchema = Yup.object({
    subCategory: Yup.string().required('Sub Category Name is required'),
    subCategorySequence: Yup.number()
        .typeError('Sub Category Sequence must be a number')
        .required('Sub Category Sequence is required')
        .min(1, 'Sub Category Sequence must be at least 1'),
    category: Yup.string().required('Category is required'),
    image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 10000000)) // Limit file size to 10MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
    status: Yup.string().required('Status is required'),
})

const Edit_subCategory = ({ handleClose, data }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(startGetAllCategory())
    }, [dispatch])

    const category = useSelector((state) => state.category.data)

    const formik = useFormik({
        initialValues: {
            subCategory: data?.subCategory || '',
            subCategorySequence: data?.subCategorySequence || '',
            category: data?.categoryId._id || '',
            image: data?.image || null,
            status: data?.status ? "Active" : "Inactive",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            // Handle form submission, including updating the product
            const formData = new FormData()
            formData.append('subCategory', values.subCategory)
            formData.append('subCategorySequence', values.subCategorySequence)
            formData.append('category', values.category)
            if (values.image instanceof File) {
                formData.append('image', values.image)
            }
            formData.append('status', values.status === 'Active' ? true : false)

            dispatch(startUpdateSubCategory(data._id, formData, handleClose, resetForm))
        },
    })

    const handleFileChange = (e) => {
        formik.setFieldValue('image', e.target.files[0])
    }

    useEffect(() => {
        if (data?.image) {
            formik.setFieldValue('image', data.image)
        }
    }, [data?.image])

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
                <label htmlFor="subCategory" className="form-label">Sub Category Name:</label>
                <input
                    id="subCategory"
                    name="subCategory"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('subCategory')}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.subCategory && formik.errors.subCategory ? (
                    <div className="text-danger">{formik.errors.subCategory}</div>
                ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor="subCategorySequence" className="form-label">Sub Category Sequence:</label>
                <input
                    id="subCategorySequence"
                    name="subCategorySequence"
                    type="number"
                    className="form-control"
                    {...formik.getFieldProps('subCategorySequence')}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.subCategorySequence && formik.errors.subCategorySequence ? (
                    <div className="text-danger">{formik.errors.subCategorySequence}</div>
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
                <label htmlFor="image" className="form-label">Image:</label>
                {formik.values.image && (
                    <div className="mb-3">
                        <img
                            src={`http://localhost:3096/${formik.values.image}`}
                            alt="subCategory"
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

            <button type="submit" className="btn btn-primary">Update Sub Category</button>
        </form>
    )
}

export default Edit_subCategory
