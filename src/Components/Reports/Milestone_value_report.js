/**
 *
 * MS report page
 * 
*/

import React, { Component, useEffect, useState } from 'react';
import { Urls } from '../../Config/Config';
import { Link } from 'react-router-dom';
import './Report.css';
import Select from 'react-select';
import ReactDatePicker from 'react-datepicker';

const Msreport=()=>
{
    // variable initialization
    const [MSArray, setMSArray] = useState([]);
    const [PracticeArray, setPracticeArray] = useState([]);
    const [totalMileStoneValue, setTotalMS] = useState(0);
    const [totalKickoffValue, setTotalKickoff] = useState(0);
    const [totalCarryValue, setTotalCarry] = useState(0);
    const [filterMileStoneValue, setFilterMS] = useState(0);
    const [SumofMileStoneValue, setSumMS] = useState(0);
    const [sumoffilterMileStoneValue, setSumFilterMS] = useState(0);
    const invoice_dropdown_value = Urls.milestone_achieved_dropdown_value;
    const [currentFilter, setCurrentFilter] = useState({'id':'0', 'value':'All'});
    const report = useState({});
    const user_types = Urls.user_types;
    const reports_lists = Urls.reports_lists;
    const current_report = Urls.reports_lists[0];
    /**
     * 
     * get milestone and practice data
     * 
     */
    useEffect(() =>{
        // return get(Urls.apiLink.get_tech_lead_list,{

        // })
        return fetch(Urls.apiLink.get_milestone_value_report,{
            method: "POST",                
            body: JSON.stringify({
                reportDetails:{
                    end_date: "2021-12-01T18:30:00.000Z",
                    head_id: "",
                    isCollectionPotential: false,
                    practice: [],
                    project_practice: [1, 2, 3, 10, 38, 69, 70, 96],
                    selectedInvoiceStatus: {id: "0", value: "All"},
                    service: [{id: 1, value: "Cloud - 2", head: 92, bu: 2}],
                    start_date: "2021-12-17T05:54:07.362Z",
                    userTypeId: 0,
                    viewAll: 1
                }
            }),               
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        }).then(res => res.json()).then(result => {
            console.log(result)
            setMSArray(result.result.milestoneReport)
            setPracticeArray(result.result.practiceReport)
            setTotalMS(result.result.totalMileStoneValue)
            setTotalKickoff(result.result.totalKickoffValue)
            setTotalCarry(result.result.totalCarryValue)
        })
        // .then(response => response.json(); console.log(response));
        // .then(({ result: MSArray }) => {
        //     setMSArray(result);
        //     setTimeout(() => {
        //         console.log(MSArray)
        //     }, 5000);
        // });
    }, [])    
    // console.log(MSArray)
    // console.log(PracticeArray)
    /**
     * 
     * functions
     * 
     */    
    function selectFilterMs(value){
        setCurrentFilter(value);
      
    }

    function generateMileStoneValueReport() {
        console.log("hi")
        //var searchQuery = this.state.searchQuery;
        console.log(currentFilter)
        //
      }
    /**
     * 
     * html render
     * 
     */
    return (
        <div className='content-wrapper content-wrapper--with-bg project-area report-page'>
            <div className='page-content p-0'>
                <div id="preloader" ng-if="milestonevalue_Report_Loading">
                    <div id="status">&nbsp;</div>
                    <h1>Milestone Value Report</h1>
                </div>
                <button ng-if="reports_lists[6].value == current_report.value" onClick={generateMileStoneValueReport()}>
                                                        Generate
                </button>
              </div>
        </div>
    );
};
 
export default Msreport;