import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DomHandler from '../utils/DomHandler';
import {TieredMenuSub} from './TieredMenuSub';
import { CSSTransition } from 'react-transition-group';

export class TieredMenu extends Component {

    static defaultProps = {
        id: null,
        model: null,
        popup: false,
        style: null,
        className: null,
        autoZIndex: true,
        baseZIndex: 0,
        appendTo: null,
        onShow: null,
        onHide: null
    };

    static propTypes = {
        id: PropTypes.string,
        model: PropTypes.array,
        popup: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        autoZIndex: PropTypes.bool,
        baseZIndex: PropTypes.number,
        appendTo: PropTypes.any,
        onShow: PropTypes.func,
        onHide: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: !props.popup
        };

        this.onEnter = this.onEnter.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.onExit = this.onExit.bind(this);
    }

    toggle(event) {
        if (this.props.popup) {
            if (this.state.visible)
                this.hide(event);
            else
                this.show(event);
        }
    }

    show(event) {
        this.target = event.currentTarget;
        let currentEvent = event;

        this.setState({ visible: true }, () => {
            if (this.props.onShow) {
                this.props.onShow(currentEvent);
            }
        });
    }

    hide(event) {
        let currentEvent = event;
        this.setState({ visible: false }, () => {
            if (this.props.onHide) {
                this.props.onHide(currentEvent);
            }
        });
    }

    onEnter() {
        if (this.props.autoZIndex) {
            this.container.style.zIndex = String(this.props.baseZIndex + DomHandler.generateZIndex());
        }
        DomHandler.absolutePosition(this.container,  this.target);
    }

    onEntered() {
        this.bindDocumentListeners();
    }

    onExit() {
        this.target = null;
        this.unbindDocumentListeners();
    }

    bindDocumentListeners() {
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
    }

    unbindDocumentListeners() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = (event) => {
                if (this.props.popup && this.state.visible && !this.container.contains(event.target)) {
                    this.hide(event);
                }
            };

            document.addEventListener('click', this.documentClickListener);
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = (event) => {
                if (this.state.visible) {
                    this.hide(event);
                }
            };

            window.addEventListener('resize', this.documentResizeListener);
        }
    }

    unbindDocumentResizeListener() {
        if(this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }

    componentWillUnmount() {
        this.unbindDocumentListeners();
    }

    renderElement() {
        const className = classNames('p-tieredmenu p-component', {'p-tieredmenu-overlay': this.props.popup}, this.props.className);

        return (
            <CSSTransition classNames="p-connected-overlay" in={this.state.visible} timeout={{ enter: 120, exit: 100 }}
                unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExit={this.onExit}>
                <div ref={el => this.container = el} id={this.props.id} className={className} style={this.props.style}>
                    <TieredMenuSub model={this.props.model} root popup={this.props.popup} />
                </div>
            </CSSTransition>
        );
    }

    render() {
        const element = this.renderElement();

        if (this.props.appendTo)
            return ReactDOM.createPortal(element, this.props.appendTo);
        else
            return element;
    }
}
