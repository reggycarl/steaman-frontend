import Link from 'next/link'
import React, { Component } from 'react'
import { FaFilter, FaList, FaSort, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

export default class SortWidget extends Component {
     filters = [
        {name: "Recommended", val: 'rec'},
        {name: "Lowest Prices", val: 'lp'},
        {name: "Highest Prices", val: 'hp'},
    ]
    state={
        filter: this.props.filter || "rec"

    }
    filterBy = ( val, e) => {
        console.log(e)
        console.log(val);
        this.props.filterBy(val)
    }
    render() {
        var filter = this.props.filter;
        if (filter == "undefined"){
            filter = "rec"
        }
        return (
            <div className='sortWidget'>
                <h6><FaFilter />  Sort By:  </h6><UncontrolledDropdown nav  className={""}>
                        <DropdownToggle nav caret >
                            <span className='icon'></span>
                            <span>{this.filters.find((obj) => obj.val == (filter || "rec")).name}</span>
                        </DropdownToggle>
                        <DropdownMenu >
                        {this.filters.map(filter => {
                            return <a className={`dropdown-item ${this.props.filter == filter.val ? "selected" : "" }`} href='#' onClick={this.filterBy.bind(this, filter.val)}><><FaSortAmountUp /><span>{filter.name} </span></></a> 
                        })}
                        
                        </DropdownMenu>
                        </UncontrolledDropdown>
                        
            </div>
        )
    }
}
