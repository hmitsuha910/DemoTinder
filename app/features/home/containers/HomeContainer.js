import React, { Component } from 'react';
import HomeView from './HomeView';
import { connect } from 'react-redux';

class HomeContainer extends Component {
    render() {
        return <HomeView {...this.props} />;
    }
}

function mapStateToProps(state) {
    return {};
}
function mapDispatchToProps(dispatch) {
    return {};
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);
