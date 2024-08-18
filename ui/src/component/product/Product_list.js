import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as PrimeButton } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import Product_form from './Product_form'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { startDeleteProduct, startGetAllProduct } from '../../actions/product_actios'
import { startGetAllCategory } from '../../actions/category_actions'
import { startGetAllSubCategory } from '../../actions/subCategory_actions'
import Edit_product from './Edit_product'
import { Button } from 'react-bootstrap'

const Product_list = () => {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  //dispatch
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(startGetAllProduct())
  }, [dispatch])
  const data = useSelector(state => state.product.data)
  useEffect(() => {
    dispatch(startGetAllCategory())
    dispatch(startGetAllSubCategory())
  }, [dispatch, data])
  const categories = useSelector(state => state.category.data)
  const subCategories = useSelector(state => state.subCategory.data)
  //get categories based on id
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.category : 'Unknown Category'
  };
  //get sub categories based on id
  const getSubCategoryName = (subCategoryId) => {
    const subCategory = subCategories.find(sub => sub._id === subCategoryId);
    return subCategory ? subCategory.subCategory : 'Unknown Sub Category'
  };

  const categoryNameTemplate = (rowData) => {
    return getCategoryName(rowData.categoryId);
  };

  const subCategoryNameTemplate = (rowData) => {
    return getSubCategoryName(rowData.subCategoryId);
  };

  const filteredCategories = data?.filter(ele =>
    ele.productName.toLowerCase().includes(search.toLowerCase())
  )
  const handleEdit = (data) => {
    setEditData(data);
    setShowEditModal(true);
  }

  // handle delete
  const handleDelete = (id) => {
    dispatch(startDeleteProduct(id))
  }
  // handle add product
  const handleAddProduct = () => {
  setShowAddModal(!showAddModal)
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <PrimeButton
          icon={<FontAwesomeIcon icon={faEdit} />}
          className="p-button-rounded p-button-info p-mr-2"
          onClick={() => handleEdit(rowData)}
        />
        <PrimeButton
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData._id)}
        />
      </div>
    )
  }

  return (
    <>
      <div style={{ padding: '20px', marginLeft: "15rem" }} >
        <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
          <h2>Product List</h2>

          <PrimeButton
            label="Add Product"
            icon="pi pi-plus"
            className="btn btn-primary"
            onClick={handleAddProduct}
            style={{ marginLeft: '40rem' }}
          />

        </div>

        <div className="p-d-flex p-ai-center p-mb-3">
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category name"
            style={{ width: '200px', paddingTop: '4px' }}
          />
        </div>

        <DataTable value={filteredCategories} paginator rows={4} className="p-datatable-sm">
          <Column body={(rowData, options) => options.rowIndex + 1} header="ID" sortable></Column>
          <Column field="productName" header="Product Name" sortable></Column>
          <Column field="categoryId" header="Category Name" body={categoryNameTemplate} sortable></Column>
          <Column field="subCategoryId" header="Sub Category Name" body={subCategoryNameTemplate} sortable></Column>
          <Column field="image" header="Image" body={(rowData) => <img src={`http://localhost:3096/${rowData.image}`} alt={rowData.categoryName} style={{ width: '50px', height: '50px' }} />} />
          <Column field="status" body={(rowData) => (rowData.status ? 'Active' : 'Inactive')} header="Status" sortable></Column>
          <Column body={actionBodyTemplate} header="Action" style={{ textAlign: 'center' }} />
        </DataTable>
      </div>
      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Product_form handleClose={() => setShowAddModal(false)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Edit_product handleClose={() => setShowEditModal(false)} data={editData} isEdit />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}


export default Product_list
