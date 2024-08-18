import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button as PrimeButton } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faL, faTrash } from '@fortawesome/free-solid-svg-icons';
import Category_form from './Category_form'
import { startDeleteCategory, startGetAllCategory } from '../../actions/category_actions'
import { Button } from 'react-bootstrap'

import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux'
import Edit_category from './Edit_category'
const Category_list = () => {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(startGetAllCategory())
  }, [dispatch])
  const data = useSelector((state) => state.category.data) || []
  console.log(data);
  const handleEdit = (data) => {
    setEditData(data)
    setShowEditModal(!showEditModal)
  }

  const handleDelete = (id) => {
    dispatch(startDeleteCategory(id))
  }

  //handle add category
  const handleAddCategory = () => {
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
          <h2>Category List</h2>

          <PrimeButton
            label="Add Category"
            icon="pi pi-plus"
            className="btn btn-primary"
            onClick={handleAddCategory}
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

        <DataTable value={data} paginator rows={4} className="p-datatable-sm">
          <Column body={(rowData, options) => options.rowIndex + 1} header="ID" sortable></Column>
          <Column field="category" header="Category Name" sortable></Column>
          <Column field="image" header="Image" body={(rowData) => <img src={`http://localhost:3096/${rowData.image}`} alt={rowData.categoryName} style={{ width: '50px', height: '50px' }} />} />
          <Column field="status" body={(rowData) => (rowData.status ? 'Active' : 'Inactive')} header="Status" sortable></Column>
          <Column field="categorySequence" header="Sequence" sortable></Column>
          <Column body={actionBodyTemplate} header="Action" style={{ textAlign: 'center' }} />
        </DataTable>
      </div>
      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Category_form handleClose={() => setShowAddModal(false)} />
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
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Edit_category handleClose={() => setShowEditModal(false)} data={editData} isEdit />
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

export default Category_list
