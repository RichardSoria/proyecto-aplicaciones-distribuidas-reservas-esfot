import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react'

export const  ConfirmModal = ({ visible, onClose, onConfirm, title, message }) => {
    return (
        <CModal backdrop="static" visible={visible} onClose={onClose} alignment='center'>
            <CModalHeader>
                <CModalTitle className='textos-esfot'>{title || '¿Estás seguro?'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {message || 'Esta acción no se puede deshacer.'}
            </CModalBody>
            <CModalFooter>
                <CButton onClick={onClose}>Cancelar</CButton>
                <CButton className='btn-esfot' onClick={onConfirm}>Confirmar</CButton>
            </CModalFooter>
        </CModal>
    )
}