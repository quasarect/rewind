import React from 'react'

import Modal from '../utils/Modal'

function SearchUser({ onClose }) {
  return (
    <Modal onClose={onClose} title='Search User' showActions={false}>
      Search User
    </Modal>
  )
}

export default SearchUser
