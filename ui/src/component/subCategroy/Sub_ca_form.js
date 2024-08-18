import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { startGetAllCategory } from '../../actions/category_actions'
import { startAddSubCategory } from '../../actions/subCategory_actions'

// Validation schema using Yup
const validationSchema = Yup.object({
    category: Yup.string()
        .required('Category is required'),
    subCategory: Yup.string()
        .required('Subcategory is required'),
    sequence: Yup.number()
        .typeError('Sequence must be a number')
        .required('Sequence is required')
        .positive('Sequence must be a positive number')
        .integer('Sequence must be an integer')
        .transform(value => (value === '' ? undefined : value)),
    image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 10000000)) // Limit file size to 10MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type)))
})

const Sub_ca_form = ({ handleClose,id,isEdit }) => {

    const [subCategory, setSubCategory] = useState('')
    const [category, setCategory] = useState('')
    const [sequence, setSequence] = useState('')
    const [image, setImage] = useState(null)
    const [errors, setErrors] = useState({})

    const dispatch = useDispatch()

    // Get all categories
    useEffect(() => {
        dispatch(startGetAllCategory())
    }, [dispatch])

    const allCategory = useSelector((state) => state.category.data) || []
    console.log(allCategory);


    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'category') {
            setCategory(value)
        } else if (name === 'subCategory') {
            setSubCategory(value)
        } else if (name === 'sequence') {
            setSequence(value)
        }
    }

    const handleFileChange = (e) => {
        setImage(e.target.files[0])
    }

    const validateField = (name, value) => {
        try {
            const fieldSchema = Yup.object().shape({
                [name]: validationSchema.fields[name]
            });
            fieldSchema.validateSync({ [name]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        } catch (err) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    }

    const validateForm = () => {
        try {
            validationSchema.validateSync({
                category,
                subCategory,
                sequence,
                image
            }, { abortEarly: false })

            setErrors({})
            return true
        } catch (err) {
            const formattedErrors = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message
                return acc
            }, {})
            setErrors(formattedErrors)
            return false
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            const formData = { category, subCategory, sequence, image }
            const reset = () => {
                setCategory('')
                setSubCategory('')
                setImage(null)
                setSequence('')
            }
            dispatch(startAddSubCategory(formData, reset, handleClose))
        }
    }

    return (
        <div className="container mt-2">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category:</label>
                            <select
                                id="category"
                                name="category"
                                className="form-control"
                                value={category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="">Select a category</option>
                                {allCategory?.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.category}</option>
                                ))}
                            </select>
                            {errors.category && <div className="text-danger">{errors.category}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="subCategory" className="form-label">Subcategory:</label>
                            <input
                                id="subCategory"
                                name="subCategory"
                                type="text"
                                className="form-control"
                                value={subCategory}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.subCategory && <div className="text-danger">{errors.subCategory}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="sequence" className="form-label">Sequence:</label>
                            <input
                                id="sequence"
                                name="sequence"
                                type="number"
                                className="form-control"
                                value={sequence}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.sequence && <div className="text-danger">{errors.sequence}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image:</label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                className="form-control"
                                accept="image/jpeg, image/png"
                                onChange={handleFileChange}
                                onBlur={handleBlur}
                            />
                            {errors.image && <div className="text-danger">{errors.image}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Sub_ca_form
