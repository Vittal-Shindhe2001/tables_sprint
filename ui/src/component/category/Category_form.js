import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { startAddCategory, startGetAllCategory } from '../../actions/category_actions'

// Validation schema using Yup
const validationSchema = Yup.object({
    category: Yup.string()
        .required('Category is required'),
    sequence: Yup.number()
        .required('Sequence is required')
        .positive('Sequence must be a positive number')
        .integer('Sequence must be an integer'),
    image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File too large', value => !value || (value && value.size <= 10000000)) // Limit file size to 10MB
        .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
})

const CategoryForm = ({ handleClose }) => {
    const [category, setCategory] = useState('')
    const [sequence, setSequence] = useState('')
    const [image, setImage] = useState(null)
    const [errors, setErrors] = useState({})
    
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'category') {
            setCategory(value)
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
            })
            fieldSchema.validateSync({ [name]: value })
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
        } catch (err) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }))
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        validateField(name, value)
    }

    const validateForm = () => {
        try {
            validationSchema.validateSync({
                category,
                sequence,
                image,
            }, { abortEarly: false })

            setErrors({})
            return true
        } catch (err) {
            const formattedErrors = err.inner?.reduce((acc, error) => {
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
            const formData = { category, sequence, image }
            const reset = () => {
                setCategory('')
                setImage(null)
                setSequence('')
            }
            dispatch(startAddCategory(formData, reset, handleClose))
        }
    }

    return (
        <div className="container mt-2">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category:</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                className="form-control"
                                value={category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.category && <div className="text-danger">{errors.category}</div>}
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

export default CategoryForm
