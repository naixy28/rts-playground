import * as React from 'react';
class Apple extends React.Component<any, any> {
    state = {
        text: 'xiaomi 9'
    }
    handleChange = () => {
        this.setState({
            text: 'xiaomi 2'
        })
    }
    render () {
        return <>
            <button onClick={this.handleChange}>点我换机子</button>
            {this.state.text}
        </>
    }
}
export default Apple