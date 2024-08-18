import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as PrimeButton } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Sub_ca_form from './Sub_ca_form'
import { useDispatch, useSelector } from 'react-redux'
import { startDeleteSubCategory, startGetAllSubCategory } from '../../actions/subCategory_actions'
import { startGetAllCategory } from '../../actions/category_actions'
import Edit_subCategory from './Edit_subCategory'
import { Button } from 'react-bootstrap'

const Sub_ca_list = () => {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  //dispatch 
  const dispacth = useDispatch()
  useEffect(() => {
    dispacth(startGetAllSubCategory())
  }, [dispacth])
  const data = useSelector(state => state.subCategory.data)
  useEffect(() => {
    dispacth(startGetAllCategory())
  }, [dispacth,data])

  const categories = useSelector(state => state.category.data)

  //get categories based on id
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId._id)
    return category ? category.category : 'Unknown Category'
  };
  const categoryNameTemplate = (rowData) => {
    return getCategoryName(rowData.categoryId);
  };


  const filteredCategories = data.filter(ele =>
    ele.subCategory.toLowerCase().includes(search.toLowerCase())
  )
  
  const handleEdit = (data) => {
    setEditData(data);
    setShowEditModal(true);
  }

  const handleDelete = (id) => {
    dispacth(startDeleteSubCategory(id))
  }
  const handleAddSubCategory = () => {
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
          <h2>Sub Category List</h2>

          <PrimeButton
            label="Add Sub Category"
            icon="pi pi-plus"
            className="btn btn-primary"
            onClick={handleAddSubCategory}
            style={{ marginLeft: '40rem' }}
          />

        </div>

        <div className="p-d-flex p-ai-center p-mb-3">
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category name"
            style={{ width: '200px' }}

          />
        </div>

        <DataTable value={filteredCategories} paginator rows={4} className="p-datatable-sm">
          <Column body={(rowData, options) => options.rowIndex + 1} header="ID" sortable></Column>
          <Column field="subCategory" header="subCategory Name" sortable></Column>
          <Column field="categoryId" header="Category Name" body={categoryNameTemplate} sortable></Column>
          <Column field="image" header="Image" body={(rowData) => <img src={`http://localhost:3096/${rowData.image}`} alt={rowData.categoryName} style={{ width: '50px', height: '50px' }} />} />
          <Column field="status" header="Status" body={(rowData) => (rowData.status ? 'Active' : 'Inactive')} sortable></Column>
          <Column field="subCategorySequence" header="Sequence" sortable></Column>
          <Column body={actionBodyTemplate} header="Action" style={{ textAlign: 'center' }} />
        </DataTable>
      </div>
     {/* Add Product Modal */}
     <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Sub Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Sub_ca_form handleClose={() => setShowAddModal(false)} />
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
          <Modal.Title>Edit Sub Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Edit_subCategory handleClose={() => setShowEditModal(false)} data={editData} isEdit />
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

export default Sub_ca_list
