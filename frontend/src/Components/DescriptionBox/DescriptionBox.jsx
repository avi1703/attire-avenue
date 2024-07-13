import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>E-commerce websites for shopping are online platforms where consumers can browse, select, and purchase a variety of products from different categories. These websites offer a range of features to facilitate the shopping experience, such as product search, detailed descriptions, customer reviews, secure payment options, and shipping services. </p>
        <p>
          The term was coined and first employed by Robert Jacobson, Principal Consultant to the California State Assembly's Utilities & Commerce Committee, in the title and text of California's Electronic Commerce Act, carried by the late Committee Chairwoman Gwen Moore (D-L.A.) and enacted in 1984
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
