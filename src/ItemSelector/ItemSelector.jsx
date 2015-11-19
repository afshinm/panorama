import React, { PropTypes } from 'react';
import { PanoramaDispatcher, PanoramaEventTypes } from '../PanoramaDispatcher.js';
import './style.scss';

export default class ItemSelector extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
    selectedIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedItem: PropTypes.object
  }

  static defaultProps = {
    title: '',
    items: [],
    selectedIndex: '',
    selectedItem: null
  }

  constructor (props) {

    super(props);

    // manually bind event handlers,
    // since React ES6 doesn't do this automatically
    this.onItemClick = this.onItemClick.bind(this);
    this.onArrowMouseDown = this.onArrowMouseDown.bind(this);
    this.onArrowMouseUp = this.onArrowMouseUp.bind(this);
    this.animateScrollPosition = this.animateScrollPosition.bind(this);

  }

  componentWillMount () {

    //

  }

  componentDidMount () {

    this.scrollToSelectedItem();

  }

  componentWillUnmount () {

    //

  }

  componentDidUpdate () {

    this.scrollToSelectedItem();

  }

  onItemClick (event) {

    // Defense.
    if (!event.currentTarget || !event.currentTarget.dataset) { return; }

    // Notify any subscribers of item selection
    PanoramaDispatcher.ItemSelector.selected(this.props.items[event.currentTarget.dataset.index], event.currentTarget.dataset.index);

  }

  onArrowMouseDown (event) {

    let dir;
    if (event.target.classList.contains('up-arrow')) {
      dir = -1;
    } else if (event.target.classList.contains('down-arrow')) {
      dir = 1;
    }
    if (!dir) { return; }

    let itemList = this.refs['item-list'],
      nextAccelCounter = 16,
      accelCounter = 0,
      itemEl = itemList.querySelector('li'),
      itemMetrics = window.getComputedStyle(itemEl),
      speed = itemEl.offsetHeight + (itemMetrics ? parseFloat(itemMetrics['margin-bottom'].replace('px', '')) : 0);

    this.arrowMouseUp = false;

    let onArrowMouseHold = function () {
      if (accelCounter-- <= 1) {
        this.scrollToPosition(itemList.scrollTop + dir * speed);
        accelCounter = nextAccelCounter = Math.max(1, Math.floor(nextAccelCounter * 0.75));
      }
      
      if (!this.arrowMouseUp) {
        window.requestAnimationFrame(onArrowMouseHold);
      }
    }.bind(this);

    window.requestAnimationFrame(onArrowMouseHold);

  }

  onArrowMouseUp (event) {

    this.arrowMouseUp = true;
    
  }

  scrollToPosition (position) {

    if (typeof this.targetScrollPosition === 'undefined') {
      // Not currently animating, so start
      this.targetScrollPosition = position;
      this.animateScrollPosition();
    } else {
      // Already animating; just update target
      this.targetScrollPosition = position;
    }

  }

  scrollToSelectedItem () {

    let itemList = this.refs['item-list'],
      selectedItem = itemList.querySelector('.selected');

    if (selectedItem) {
      this.scrollToPosition(selectedItem.offsetTop - itemList.offsetHeight);
    }

  }

  animateScrollPosition () {

    let itemList = this.refs['item-list'],
      delta;

    if (typeof this.scrollPosition === 'undefined') {
      this.scrollPosition = itemList.scrollTop;
    }

    delta = this.targetScrollPosition - this.scrollPosition;
    
    if (Math.abs(delta) > 1) {
      this.scrollPosition += 0.25 * delta;
      itemList.scrollTop = this.scrollPosition; // scrollTop rounds to the nearest int
      window.requestAnimationFrame(this.animateScrollPosition);
    } else {
      itemList.scrollTop = this.targetScrollPosition;
      this.targetScrollPosition = undefined;
      this.scrollPosition = undefined;
    }
  }

  getDefaultState () {

    return {};

  }

  render () {

    return (
      <div className='panorama item-selector'>
        <h3>{ this.props.title }</h3>
        <div className='scroll-arrow up-arrow' onMouseDown={ this.onArrowMouseDown } onMouseUp={ this.onArrowMouseUp } />
        <ul ref='item-list'>
          { this.props.items.map((item, i) => {

            return (
              <li
                className = { 'item' + ((this.props.selectedItem.id == item.id || this.props.selectedIndex === i) ? ' selected' : '') }
                data-index = { i }
                key = { i }
                onClick = { this.onItemClick }
              >
                <span>{ item.name.toUpperCase() }</span>
              </li>
            );

          }) }
        </ul>
        <div className='scroll-arrow down-arrow' onMouseDown={ this.onArrowMouseDown } onMouseUp={ this.onArrowMouseUp } />
      </div>
    );

  }

}
