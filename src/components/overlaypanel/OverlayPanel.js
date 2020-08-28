import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import DomHandler from '../utils/DomHandler';
import { CSSTransition } from 'react-transition-group';
import { Ripple } from '../ripple/Ripple';

export class OverlayPanel extends Component {

    static defaultProps = {
        id: null,
        dismissable: true,
        showCloseIcon: false,
        style: null,
        className: null,
        appendTo: null,
        ariaCloseLabel: 'close',
        onHide: null
    }

    static propTypes = {
        id: PropTypes.string,
        dismissable: PropTypes.bool,
        showCloseIcon: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        appendTo: PropTypes.any,
        ariaCloseLabel: PropTypes.string,
        onHide: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.onCloseClick = this.onCloseClick.bind(this);
        this.onPanelClick = this.onPanelClick.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.onExit = this.onExit.bind(this);
    }

    bindDocumentClickListener() {
        if(!this.documentClickListener && this.props.dismissable) {
            this.documentClickListener = (event) => {
                if (!this.isPanelClicked && this.isOutsideClicked(event)) {
                    this.hide();
                }

                this.isPanelClicked = false;
            };

            document.addEventListener('click', this.documentClickListener);
        }
    }

    unbindDocumentClickListener() {
        if(this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }

    isOutsideClicked(event) {
        return this.container && !(this.container.isSameNode(event.target) || this.container.contains(event.target));
    }

    hasTargetChanged(event, target) {
        return this.target != null && this.target !== (target||event.currentTarget||event.target);
    }

    onCloseClick(event) {
        this.hide();

        event.preventDefault();
    }

    onPanelClick() {
        this.isPanelClicked = true;
    }

    toggle(event, target) {
        if (this.state.visible) {
            this.hide();

            if (this.hasTargetChanged(event, target)) {
                this.target = target||event.currentTarget||event.target;

                setTimeout(() => {
                    this.show(event, this.target);
                }, 200);
            }
        }
        else {
            this.show(event, target);
        }
    }

    show(event, target) {
        this.target = target||event.currentTarget||event.target;

        if (this.state.visible) {
            this.align();
        }
        else {
            this.setState({ visible: true });
        }
    }

    hide() {
        this.setState({ visible: false }, () => {
            if (this.props.onHide) {
                this.props.onHide();
            }
        });
    }

    onEnter() {
        this.container.style.zIndex = String(DomHandler.generateZIndex());
        this.align();
    }

    onEntered() {
        this.bindDocumentClickListener();
    }

    onExit() {
        this.unbindDocumentClickListener();
    }

    align() {
        if (this.target) {
            DomHandler.absolutePosition(this.container, this.target);

            if (DomHandler.getOffset(this.container).top < DomHandler.getOffset(this.target).top) {
                DomHandler.addClass(this.container, 'p-overlaypanel-flipped');
            }
        }
    }

    componentWillUnmount() {
        this.unbindDocumentClickListener();
    }

    renderCloseIcon() {
        if(this.props.showCloseIcon) {
            return (
                <button type="button" className="p-overlaypanel-close p-link" onClick={this.onCloseClick} aria-label={this.props.ariaCloseLabel}>
                    <span className="p-overlaypanel-close-icon pi pi-times"></span>
                    <Ripple />
                </button>
            );
        }

        return null;
    }

    renderElement() {
        let className = classNames('p-overlaypanel p-component', this.props.className);
        let closeIcon = this.renderCloseIcon();

        return (
            <CSSTransition classNames="p-overlaypanel" in={this.state.visible} timeout={{ enter: 120, exit: 100 }}
                unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExit={this.onExit}>
                <div ref={el => this.container = el} id={this.props.id} className={className} style={this.props.style} onClick={this.onPanelClick}>
                    <div className="p-overlaypanel-content">
                        {this.props.children}
                    </div>
                    {closeIcon}
                </div>
            </CSSTransition>
        );
    }

    render() {
        let element = this.renderElement();

        if (this.props.appendTo) {
            return ReactDOM.createPortal(element, this.props.appendTo);
        }
        else {
            return element;
        }
    }
}
