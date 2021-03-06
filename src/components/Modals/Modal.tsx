import * as React from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export default class Modal extends React.Component {

    node: HTMLDivElement;

    constructor(props: any) {
        super(props);
        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);
    }

    render() {
        return createPortal(
            <section className="modal form-container">
                {this.props.children}
            </section>,
            this.node
        );
    }

    componentWillUnmount() {
        window.document.body.removeChild(this.node);
    }
}