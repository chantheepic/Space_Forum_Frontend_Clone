import React from 'react'
import { Container, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            session: props.session,
            category: props.category,
            collection: []
        };
    }

    componentDidMount() {
        this.props.collection.then(data => this.setState({collection: data}));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.collection !== this.state.collection) {
            nextProps.collection.then(data => this.setState({category: nextProps.category, collection: data}));
        }
    }

    render() {
        const results = this.state.collection.length > 0
            ? this.state.collection.map(item =>
                <tr>
                    <td>
                        <Link to={{
                            pathname: `/detail/${item.id}`,
                            state: {
                                imgId: item.id
                            }
                        }}>
                            {item.name}
                        </Link>
                    </td>
                </tr>)
            :  <tr>
                <td style={{fontStyle: 'italic'}}>
                    No results found
                </td>
            </tr>;

        return (
            <Container>
                <Table hover>
                    <thead>
                        <tr><th>{this.state.category}</th></tr>
                    </thead>
                    <tbody>
                    {results}
                    </tbody>
                </Table>
            </Container>
        )
    }
}