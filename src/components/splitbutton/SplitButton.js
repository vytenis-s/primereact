import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Button} from '../button/Button';
import classNames from 'classnames';
import DomHandler from '../utils/DomHandler';
import { SplitButtonItem } from './SplitButtonItem';
import { SplitButtonPanel } from './SplitButtonPanel';
import {tip} from "../tooltip/Tooltip";
import UniqueComponentId from "../utils/UniqueComponentId";
import { CSSTransition } from 'react-transition-group';

export class SplitButton extends Component {

    static defaultProps = {
        id: null,
        label: null,
        icon: null,
        model: null,
        disabled: null,
        style: null,
        className: null,
        menuStyle: null,
        menuClassName: null,
        tabIndex: null,
        onClick: null,
        appendTo: null,
        tooltip: null,
        tooltipOptions: null
    }

    static propTypes = {
        id: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
        model: PropTypes.array,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        menustyle: PropTypes.object,
        menuClassName: PropTypes.string,
        tabIndex: PropTypes.string,
        onClick: PropTypes.func,
        appendTo: PropTypes.object,
        tooltip: PropTypes.string,
        tooltipOptions: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            overlayVisible: false
        };

        this.onDropdownButtonClick = this.onDropdownButtonClick.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onOverlayEnter = this.onOverlayEnter.bind(this);
        this.onOverlayEntered = this.onOverlayEntered.bind(this);
        this.onOverlayExit = this.onOverlayExit.bind(this);

        this.id = this.props.id || UniqueComponentId();
    }

    onDropdownButtonClick() {
        if (this.state.overlayVisible)
            this.hide();
        else
            this.show();
    }

    onItemClick() {
        this.hide();
    }

    show() {
        this.setState({ overlayVisible: true });
    }

    hide() {
        this.setState({ overlayVisible: false });
    }

    onOverlayEnter() {
        this.panel.element.style.zIndex = String(DomHandler.generateZIndex());
        this.alignPanel();
    }

    onOverlayEntered() {
        this.bindDocumentClickListener();
    }

    onOverlayExit() {
        this.unbindDocumentClickListener();
    }

    alignPanel() {
        const container = this.defaultButton.parentElement;
        if (this.props.appendTo) {
            this.panel.element.style.minWidth = DomHandler.getWidth(container) + 'px';
            DomHandler.absolutePosition(this.panel.element, container);
        }
        else {
            DomHandler.relativePosition(this.panel.element, container);
        }
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = (event) => {
                if (this.state.overlayVisible && this.isOutsideClicked(event)) {
                    this.hide();
                }
            };

            document.addEventListener('click', this.documentClickListener);
        }
    }

    isOutsideClicked(event) {
        return this.container && (this.panel && this.panel.element && !this.panel.element.contains(event.target));
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }

    componentDidMount() {
        if (this.props.tooltip) {
            this.renderTooltip();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tooltip !== this.props.tooltip) {
            if (this.tooltip)
                this.tooltip.updateContent(this.props.tooltip);
            else
                this.renderTooltip();
        }
    }

    componentWillUnmount() {
        this.unbindDocumentClickListener();

        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    renderTooltip() {
        this.tooltip = tip({
            target: this.container,
            content: this.props.tooltip,
            options: this.props.tooltipOptions
        });
    }

    renderItems() {
        if (this.props.model) {
            return this.props.model.map((menuitem, index) => {
                return <SplitButtonItem menuitem={menuitem} key={index} onItemClick={this.onItemClick} />
            });
        }

        return null;
    }

    render() {
        let className = classNames('p-splitbutton p-component', this.props.className, {'p-disabled': this.props.disabled});
        let items = this.renderItems();

        return (
            <div id={this.props.id} className={className} style={this.props.style}  ref={el => this.container = el}>
                <Button ref={(el) => this.defaultButton = ReactDOM.findDOMNode(el)} type="button" className="p-splitbutton-defaultbutton" icon={this.props.icon} label={this.props.label} onClick={this.props.onClick} disabled={this.props.disabled} tabIndex={this.props.tabIndex}/>
                <Button type="button" className="p-splitbutton-menubutton" icon="pi pi-chevron-down" onClick={this.onDropdownButtonClick} disabled={this.props.disabled}
                        aria-expanded={this.state.overlayVisible} aria-haspopup aria-owns={this.id + '_overlay'}/>
                <CSSTransition classNames="p-connected-overlay" in={this.state.overlayVisible} timeout={{ enter: 120, exit: 100 }}
                    unmountOnExit onEnter={this.onOverlayEnter} onEntered={this.onOverlayEntered} onExit={this.onOverlayExit}>
                    <SplitButtonPanel ref={(el) => this.panel = el} appendTo={this.props.appendTo} id={this.id + '_overlay'}
                                menuStyle={this.props.menuStyle} menuClassName={this.props.menuClassName}>
                        {items}
                    </SplitButtonPanel>
                </CSSTransition>
            </div>
        );
    }
}
