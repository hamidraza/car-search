import React, {Component} from 'react';

export class Layout extends Component {
  render() {
    return (
      <div className="layout layout-default">
        {this.props.children}
      </div>
    )
  }
}
Layout.contextTypes = {
  store: React.PropTypes.object
};

export default Layout;