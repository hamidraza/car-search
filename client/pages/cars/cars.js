import React, {Component} from 'react';
import moment from 'moment';

export class CarsPage extends Component {

  state = {
    availableTypes: []
  }

  constructor(props) {
    super(props);

    this.state.filter = {
      date: {
        from: null,
        to: null
      },
      pickupDistance: 30,
      type: ''
    };


  }

  componentWillMount() {
    let {cars} = this.context.store.getState();
    let {availableTypes} = this.state;
    availableTypes = [...new Set(cars.map(c => c.type))];
    this.setState({availableTypes});
  }

  get dateFromMin() {
    return moment().add(1, 'hour');
  }
  get dateFromMax() {
    return moment().add(6, 'month');
  }
  get dateFromValue() {
    const {filter} = this.state;
    let mFrom = filter.date.from,
      mDefault = moment().add(1, 'hour');

    if(!mFrom || mFrom.isBefore(mDefault)) {
      mFrom = mDefault;
    }

    /* // Round of to 30 min
    const tMin = mFrom.minute();
    if(tMin % 30) {
      return moment(mFrom).add('minutes', 30 - tMin%30);
    } */

    return mFrom;
  }

  get dateToMin() {
    return moment().format('YYYY-MM-DDTHH:mm');
  }
  get dateToMax() {
    return moment().add(6, 'month').format('YYYY-MM-DDTHH:mm');
  }
  get dateToValue() {
    const {date} = this.state.filter;
    return date.to || (date.from ?
      moment(date.from).add(1, 'day'):
      moment().add(1, 'day').add(1, 'hour')
    );
  }

  set pickupDistance(val) {
    const {filter} = this.state;
    filter.pickupDistance = val;
    this.setState({filter});
  }

  getCars() {
    let {cars} = this.context.store.getState();
    cars = cars.filter(c => {
      const {startDate, endDate} = c.availability;
      return this.dateFromValue.isBetween(startDate, endDate, null, '[]')
        && this.dateToValue.isBetween(startDate, endDate, null, '[]');
    });
    const {filter} = this.state;

    if(filter.pickupDistance > 0) {
      cars = cars.filter(c => c.distanceKMS <= filter.pickupDistance);
    }
    if(filter.type) {
      cars = cars.filter(c => c.type == filter.type);
    }
    // if(this.dateFromValue)
    return cars;
  }

  handleDateFromChange = e => {
    const {filter} = this.state;
    filter.date.from = e.target.value? moment(e.target.value) : null;
    this.setState({filter});
  }

  handleDateToChange = e => {
    console.log(e.target.value);
    const {filter} = this.state;
    filter.date.to = e.target.value? moment(e.target.value) : null;
    this.setState({filter});
  }

  handlePickupDistanceChange = e => {
    const {filter} = this.state;
    filter.pickupDistance = e.target.value;
    this.setState({filter});
  }

  handleRangeNumberClick = val => {
    const {filter} = this.state;
    filter.pickupDistance = val;
    this.setState({filter});
  }

  handleFilterTypeChange = e => {
    const {filter} = this.state;
    filter.type = e.target.value;
    this.setState({filter});
  }


  render() {
    const {filter, availableTypes} = this.state,
      Cars = this.getCars();

    const {
      dateFromValue,
      dateToValue,
      dateFromMin,
      dateToMin,
      dateFromMax,
      dateToMax
    } = this;

    return (
      <div className="page page-cars">
        {/*Cars.map(c => 
          <div key={c.id}>{c.brand}</div>
        )*/}
        <header className="main">
          <div className="container">
            <div className="logo">
              <img src="/img/logo.png" alt=""/>
            </div>
          </div>
        </header>



        <div className="car-filter">

          <div className="filter-wrap">
            <div className="filter-box">
              <label htmlFor="">Date range</label>
              <div className="date-field-wrap">
                <div className="field-wrap ">
                  <label className="lbl">From</label>
                  <input
                    className="field"
                    type="datetime-local"
                    value={dateFromValue.format('YYYY-MM-DDTHH:mm')}
                    onChange={this.handleDateFromChange}
                    min={dateFromMin.format('YYYY-MM-DDTHH:mm')}
                    max={dateFromMax.format('YYYY-MM-DDTHH:mm')}
                  />
                </div>

                <div className="field-wrap ">
                  <label className="lbl">To</label>
                  <input
                    className="field"
                    type="datetime-local"
                    value={dateToValue.format('YYYY-MM-DDTHH:mm')}
                    onChange={this.handleDateToChange}
                    min={dateToMin}
                    max={dateToMax}
                  />
                </div>

                <div className="field-wrap">
                  <label className="lbl">&nbsp;</label>
                  <div>
                    {'Pick up ' + dateFromValue.fromNow()}
                  </div>
                </div>
              </div>
              <div className="field-wrap ">
              </div>
            </div>
            <div className="filter-box">
              <label htmlFor="">Pick up distance (kms):</label>
              <div className="field-val">
                {filter.pickupDistance} Kms
              </div>
              <div className="field-wrap">
                <input type="range" min="3" max="30" step="3"
                  className="field"
                  onChange={this.handlePickupDistanceChange}
                  value={filter.pickupDistance}
                />
              </div>
              <div className="distance-steps">
                {[...Array(30/3)].map((s, i) => {
                  const val = (i+1) * 3;
                  return <span key={val}
                      onClick={e => this.pickupDistance = val}
                      className={
                        (filter.pickupDistance >= val ? 'selected ':'') +
                        (filter.pickupDistance == val ? 'active ':'')
                      }
                    >{val}</span>
                })}
              </div>
            </div>
            <div className="filter-box search-result-count">
              <label htmlFor="">Matching results</label>
              <div className="total">
                {Cars.length}
              </div>
              <div className="lbl">Car{Cars.length != 1 ? 's':''}</div>
            </div>
          </div>

          <div className="filter-bottom">
            <div className="container">
              <label>Filter by type:</label>
              <select className="uc-f" onChange={this.handleFilterTypeChange} value={filter.type}>
                <option value="">All</option>
                {availableTypes.map(t => 
                  <option value={t} key={t}>{t}</option>
                )}
              </select>
            </div>
          </div>
        </div>


        <div className="list-body">

          <div className="container">
            <h2>{Cars.length} Cars Available</h2>
            {Cars.map(c => 
              <div className="car-box" key={c.id}>
                <div className="car-img">
                  <img src={`/img/cars/${c.brand}-${c.model}.jpg`} alt=""/>
                </div>
                <div className="body">
                  <div className="content">
                    <div className="car-img">
                      <img src={`/img/cars/${c.brand}-${c.model}.jpg`} alt=""/>
                    </div>
                    <div className="logo" style={{backgroundImage: `url(/img/logos/${c.brand}.png)`}}></div>
                    <div className="details">
                      <div>
                        <h3>{c.brand} {c.model}</h3>
                        <p>Transmission: <span className="uc-f">{c.transmission}</span>, {c.seater} Seater, {c.airBags || 'No'} air bags</p>
                      </div>
                    </div>
                  </div>
                  <div className="footer">
                    <div className="left">
                      <div className="price">
                        <small>Price / Hr:</small><span> <small>&#8377;</small><strong>{c.pricePerHour}</strong><small>.00</small></span>
                      </div>
                      <div className="distance">
                        {c.distanceKMS} kms away
                      </div>
                    </div>
                    <div className="right">
                      <button className="btn-rent">Rent</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    );
  }
}
CarsPage.contextTypes = {
  store: React.PropTypes.object
};

export default CarsPage;