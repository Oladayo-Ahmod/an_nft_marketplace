import React, { useContext } from 'react';
import { MarketplaceContext } from '../../../contexts/Marketplace';

/**
 * Create component for adding new NFT items.
 */
const Create = () => {
  // Accessing context and required functions
  const { disability, setFormData, formData, CreateNft, message, imageHandler } = useContext(MarketplaceContext);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="form-wrapper">
            <form className="row" action="#">
              {/* Item Name */}
              <div className="col-md-12 m-2">
                <div className="input-box">
                  <label htmlFor="name" className="form-label">
                    Item Name
                  </label>
                  <input
                    id="name"
                    className="form-control"
                    placeholder="e.g. 'Cute Dog'"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Item Image */}
              <div className="col-md-12 mt-2">
                <div className="input-box">
                  <label htmlFor="createinputfile" className="form-label">
                    Item Image
                  </label>
                  <input
                    name="createinputfile"
                    type="file"
                    className="inputfile"
                    onChange={(e) => imageHandler(e)}
                    required
                  />
                </div>
              </div>

              {/* Item Price */}
              <div className="col-md-12 mt-2">
                <div className="input-box">
                  <label htmlFor="dollerValue" className="form-label">
                    Item Price
                  </label>
                  <input
                    id="dollerValue"
                    className="form-control"
                    required
                    placeholder="e.g. '20ETH'"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-md-12 mt-2 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
                <div className="input-box">
                  <button
                    className="btn btn-primary btn-large w-100"
                    disabled={disability}
                    type="button"
                    onClick={CreateNft}
                  >
                    {message}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
