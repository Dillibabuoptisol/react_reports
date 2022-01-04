import React, { Component, useEffect, useState } from 'react';
import { Urls } from '../../Config/Config';
import { Link } from 'react-router-dom';
import './Report.css';
import Select from 'react-select';
import ReactDatePicker from 'react-datepicker';
import {Grid,Row,Col,Container, SplitButton, Dropdown,DropdownButton, Button,Form} from 'react-bootstrap';
import Datepicker from "react-datepicker";
import Moment from 'moment';

class MileStoneReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            user_types : Urls.user_types,
            reports_lists : Urls.reports_lists,
            current_report : Urls.reports_lists[0],
            report : {},
            projectPractice : [],
            project_practice : [],
            isAllPractices : false,
            getUserscount : '',
            practiceleadName : '',
            report_practice : [],    
            gridListBackup : [],
            gridList : [],
            planned_hrs : 0,
            support_hrs : 0,
            unallocated_hrs : 0,
            effective_yield : 0,
            expected_yield : 0,
            gap_in_allocation : 0,
            deficit : 0,    
            userTypeId : 0,
            totalResAvHrCal : 0,
            msAlloc : 0,
            supphrs : 0,
            totalResourceAvailHrsFrontendCalcution : 0,
            msAllocatedHrs : 0,
            supportHrs : 0,
            benchHrs : 0,
            userTypes : Urls.user_types,
            isGanttView : false,
            updateLoader : false,
            current_Gant_popover : {},
            // for inventory report
            support_practice : [6,12,13,21],
            inventory_isDetailedView : true,
            searchByPracticeHead: '',
            // for TL and BA    
            techLeadList : [],
            businessAnalystList : [],
            techLeadId : '',
            businessAnalystId : '',
            searchByTechLead : '',
            searchByBusinessAnalyst : '',
            isChecked :false,
            // for milestone report    
            myPracticeMileStone : 0,
            allPracticeMileStone : 0,
            mileStoneValueReport : {},
            filteredMilestoneData : [],
            mileStoneReportPractice : 1,
            filterByPractice :  '',
            filterMileStoneValue : '',
            milestone_achieved_dropdown_value : Urls.milestone_achieved_dropdown_value,
            invoice_dropdown_value : Urls.milestone_achieved_dropdown_value,
            // for collection-potential report    
            currentFilter : {'id':0, 'value':'All'},
            filterNotSure : '',
            true_data : [],
            checked_data : {},
            sumoffilterMileStoneValue : 0,
            SumofMileStoneValue : 0,
            collection_potential_invoicestatus : Urls.invoice_status,
            return_to_pwreport : 0,
            resource_types : Urls.resource_types,
            resource_types_new : Urls.resource_types_new,
            resourceFilter : {'id':0, 'value':'All'},
            filter_start_date : '2022-01-01',
            filter_end_date : '',
            sname :[],
            sname1 : [],
            inventory_isDetailedView:false,
            report_practice:[],
            report_service : [],
            projectPractice :[],
            practiceHead : [],
            totalMileStoneValue : 0,
            totalKickoffValue : 0,
            totalCarryValue : 0,
            filterMileStoneValue :0,
            filteredMilestoneData:[],
            milestoneReport :[],
            mileStoneValueReport :  {},
        
            practiceReport : [],
            overallMileStoneValue : 0,
            sumOfNotSureValue : 0,
            notUpdatedValue : 0,
            totalNewValue : 0,
            totalRaisedValue : 0,
            totalCollectedValue : 0,
            totalPendingValue : 0,
            mileStoneReportMonth :'',
            mileStoneReportYear : '',
            myPracticeMileStone:0,
            allPracticeMileStone:0,
            filter:[],
            filterByPractice :[],
            filterMileStoneValue:0,
            filterNotSure:0,
            filterNotUpdated:0,
            filterNewValue:0,
            filterRaisedValue:0,
            filterCollectedValue:0,
            filterPendingValue:0,
		}
	}

    reset_page = () =>{
        this.setState({
            report : [{service:[],practice:[]}],
        })      
        this.filterService();
    }

    setStartDateForFilter = (e) =>{
        console.log(e.target.value)
        this.state.filter_start_date = e.target.value;
        this.setState({
            filter_start_date : this.state.filter_start_date
        })       
        console.log(this.state.filter_start_date)
    }

    setEndDateForFilter = (end_date) => {
        this.setState({
            filter_end_date : end_date
        })
        ;
        console.log(this.props.filter_end_date)
    }

    componentDidMount() {      
            this.getPracticeService();
	}

    selectFilterMs = (e) =>{      
        this.state.current_report = e.target.value;
        this.setState({
            current_report:this.state.current_report
        })
        this.generateMileStoneValueReport(true)       
    }
      
    selectFilter = (e,id) =>{       
        this.state.currentFilter = e.target.value;
        this.setState({currentFilter: this.state.currentFilter
        })
        this.generateMileStoneValueReport(true)
    }


     getPracticeService = (isAllPractice) => {
        this.setState({ isLoading: true });
        var date = new Date();
        var date = new Date(date.getFullYear(), date.getMonth(), 2);
        var  start_date = (this.state.filter_start_date) ? this.state.filter_start_date : date;
        var  end_date = (this.state.filter_end_date) ? this.state.filter_end_date : date;
        // self.scope.report.service = [];
        var isAllPractices = isAllPractice;
        var link = Urls.apiLink+'get_report_filters';
        console.log(link)
        return fetch(link,{
            method: "POST",                
            body:JSON.stringify( {
                start_date,
                end_date,
                isAllPractice
            }),               
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                // "Authorization" :"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQxN2M2YzJiZjcwMjJiZGU5YTU5NGQ4NzZjODAwMDQ0YTU4NTA5OWNmYzQ2MjE3ZmFiZTQ1MTk3NjAyN2ZmM2JmYTQ3ODA0NGRlM2U1NWU1In0.eyJhdWQiOiIxIiwianRpIjoiNDE3YzZjMmJmNzAyMmJkZTlhNTk0ZDg3NmM4MDAwNDRhNTg1MDk5Y2ZjNDYyMTdmYWJlNDUxOTc2MDI3ZmYzYmZhNDc4MDQ0ZGUzZTU1ZTUiLCJpYXQiOjE2NDA3NzE3MjgsIm5iZiI6MTY0MDc3MTcyOCwiZXhwIjoxNjcyMzA3NzI4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RxE4xzk9YkUlL-OcApd2bAY1j6G6wSw-D8upYxeCIZ5-wI6ZhnQiNkfzoDEqTTBeGvg8uOReXZAYn1epRpKsMzs9gD-hMwvYDYgMBIvb4rR44MEDl0HT14OsRuMvSgwvwk_AtIBMgHFdXBo1B1yS3R4bHU9eh4Pc0hNEMMX9rn_4avTBZcbWn6-ugeXzo1qQMXXA82NgJn2CgAgiqXCFZ4mZCUm5cifyQ8XImQt_eIwLRhn-ygksD_i2dKU8vcG7GX3xIXbHUGMmVj5o17s7Tsz3ae8nNgDt5-qv-d6BRNqib2emknvmfu381-Q39doMF9p_5suf0mPq6UD3nW-8Vzl-4H9lzG9qpdbROqcCia3lGY1jTGXDQJZvD1Fk9XghKtePdMkVEjKqWHS1pnV3kjcyG1KvXjbEIoivrHNPXVH8StpWfrJj8ZMGe6Etc4pCfICD2thOMvNkeoNMXfZGzIUFdzJ_x_aseaZ7Xj1sasArBmhVvWx8tZwLyEca9zjGVX5kv1JCPAYPYi1emH6Y_4GB96fkj116bgsD1ivKBV2jy_-HjqfT7mf3ENY6xJp_Zv-HHlmOSndYdCS90EWkcvA_EYGnDDVTdpdHw46HS9OiBbyZf8WyybejuYmy3kySqUOefP2iMvAyDlS6tHyxlRzRN9sSdKsWRJnrhxtAi_g"
            }
        }).then(res => res.json()).then(res => {
            console.log(res)
            this.setState({
            sname : res.result.services,
            sname1 : res.result.services,
            allService : res.result.allservices,
            })
            this.setState({
            report: [{
                service:this.state.sname[0]
                 }]
            })
            var service1 = [];
            service1.push(this.state.sname[0]);
            console.log(this.state.sname)
            if(isAllPractices == true){
                this.setState({
                    report:[{
                        service:[]
                         }]
                    })
            }else{
                this.setState({
                 report: [{
                    service:(this.state.report.service) ? this.state.report.service :service1
                     }]
                })
            }
            //for practice
            this.setState({
                report_all_practices: res.result.practices,
                //practiceHead : {bu_id: '', bu: 'All'}
               })
            // for practicehead      
            res.result.directors.forEach(id => {
               this.state.practiceHead.push(id)
           
            });
            this.setState({
                practiceHead : this.state.practiceHead
            })
            // // self.scope.practiceHeadId = self.scope.practiceHead[1]['id'];
            // if(self.scope.rootScope.loginUserData.role_id == 8){
            //     self.scope.searchByPracticeHead = self.scope.rootScope.loginUserData.id;
            // }else{
            //     self.scope.searchByPracticeHead = self.scope.searchByPracticeHead;
            // }
            console.log(this.state.isAllPractices)
            if(!this.state.isAllPractices){
                this.filterService('');
            }
            this.changeViewPracite(this.state.isAllPractices);
        })
    }

     //filter practice based on service and head
     filterService = (e) =>{
        //console.log(e.target.value)
        var ser = [];
        var report;
        console.log(this.state.reports_lists[2].value)
        console.log(this.state.current_report)
    
        console.log(report)
      if(this.state.reports_lists[2].value === 'Milestone Value Report'){
            console.log("hi")
            if(this.state.set_reset == 1){
              if(this.state.isAllPractices)
              {
                this.setState({
                    projectPractice : this.state.report_all_practices
                    })
               
              }else{
                this.setState({
                    projectPractice : this.state.report_filtered_practices
                    })
              }
              console.log(this.state.projectPractice)
              this.setState({
                report : {practice : []},
                reportHtml : ''
                })
              // for sending all practice while reset
              if(this.state.projectPractice.length>0){
                this.state.projectPractice.forEach(value => {
                    this.state.report.practice.push(value.id);
                
                 });
              }
              // end of reset
            }
            this.generateMileStoneValueReport(true);
        }
       
    }

    filterPractice = (e,practice) =>{
       if(practice)
          practice.isChecked = !practice.isChecked;
       this.state.filteredMilestoneData = [];
        var array =[];
        if(practice){
          
          var array = [];
          if(practice.isChecked==true){     
              console.log("hi")      
              this.state.sumoffilterMileStoneValue += practice.mileStoneValue;
            //   this.setState({
            //       this.state.filter,
            //   })
              this.state.filter.push(practice.practiceId);
          }
          else{
            console.log("hello") 
              this.state.sumoffilterMileStoneValue -= practice.mileStoneValue;  
              this.state.filter.forEach( value => {
                  if(value != practice.practiceId){
                      array.push(value);
                  }
              })
              // self.scope.filter.pop(practice.practiceId);
              this.state.filter = array;
          }
          console.log(this.state.filter)
          if(this.state.filter.length == 0 && !practice){
            this.state.filterByPractice = '';
            this.state.filteredMilestoneData = this.state.milestoneReport;
          }
          else{
              if(this.state.filter.length == 0 ){
                this.state.filteredMilestoneData = this.state.milestoneReport;
              }else{
                this.state.filter.forEach(result => {
                    this.setState({
                        filterByPractice : result,     
                      filterMileStoneValue : practice.mileStoneValue,
                      filterNotSure :practice.sumOfNotSureValue,
                      filterNotUpdated  :practice.notUpdatedValue,
                      filterNewValue : practice.totalNewValue,
                      filterRaisedValue : practice.totalRaisedValue,
                     filterCollectedValue : practice.totalCollectedValue,
                      filterPendingValue : practice.totalPendingValue
                    })
                    this.state.milestoneReport.forEach(data =>{
                        if(data.practiceId == result){
                            this.state.filteredMilestoneData.push(data);
                        }
                    }) 
                    //   forEach($filter('filter')(this.state.milestoneReport, {'practiceId':this.state.filterByPractice}, true), function(value, key) {
                    //     this.state.filteredMilestoneData.push(value);
                    //   }); 
                  })
              }
          }
        }
        else{
            this.setState({
                filterByPractice : '',
                filteredMilestoneData : this.state.milestoneReport
            })
           // this.filterPractice()
            // this.state.filterByPractice = '';
            // this.state.filteredMilestoneData = this.state.milestoneReport;
        }   
        console.log(this.state.filteredMilestoneData) 
        this.setState({
            filteredMilestoneData:this.state.filteredMilestoneData
        })
      }

    calculatePracticeWiseMileStone = (practiceList) =>{
        this.state.myPracticeMileStone = 0;
        this.state.allPracticeMileStone = 0;
        practiceList.forEach(practicesValue => {
       
        if(practicesValue.myPractice){
            this.setState({
                myPracticeMileStone : this.state.myPracticeMileStone + practicesValue.mileStoneValue
            })
          
        }else{
            this.setState({
                allPracticeMileStone : this.state.allPracticeMileStone + practicesValue.mileStoneValue
            })
        }
        });
    };
 
    generateMileStoneValueReport = () =>{
        console.log("hi")
        console.log(this.state.report)
        var link = Urls.apiLink+'get_milestone_value_report';
      
        return fetch(link,{
            method: "POST",                
            body: JSON.stringify({
                reportDetails:{
                    end_date: this.state.filter_end_date,
                    head_id: "",
                    isCollectionPotential: false,
                    practice: [],
                    project_practice: [1, 2, 3, 10, 38, 69, 70, 96],
                    selectedInvoiceStatus: {id: "0", value: "All"},
                    service: [{id: 1, value: "Cloud - 2", head: 92, bu: 2}],
                    start_date: this.state.filter_start_date,
                    userTypeId: 0,
                    viewAll: 1
                }
            }),               
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                // "Authorization" :"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQxN2M2YzJiZjcwMjJiZGU5YTU5NGQ4NzZjODAwMDQ0YTU4NTA5OWNmYzQ2MjE3ZmFiZTQ1MTk3NjAyN2ZmM2JmYTQ3ODA0NGRlM2U1NWU1In0.eyJhdWQiOiIxIiwianRpIjoiNDE3YzZjMmJmNzAyMmJkZTlhNTk0ZDg3NmM4MDAwNDRhNTg1MDk5Y2ZjNDYyMTdmYWJlNDUxOTc2MDI3ZmYzYmZhNDc4MDQ0ZGUzZTU1ZTUiLCJpYXQiOjE2NDA3NzE3MjgsIm5iZiI6MTY0MDc3MTcyOCwiZXhwIjoxNjcyMzA3NzI4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RxE4xzk9YkUlL-OcApd2bAY1j6G6wSw-D8upYxeCIZ5-wI6ZhnQiNkfzoDEqTTBeGvg8uOReXZAYn1epRpKsMzs9gD-hMwvYDYgMBIvb4rR44MEDl0HT14OsRuMvSgwvwk_AtIBMgHFdXBo1B1yS3R4bHU9eh4Pc0hNEMMX9rn_4avTBZcbWn6-ugeXzo1qQMXXA82NgJn2CgAgiqXCFZ4mZCUm5cifyQ8XImQt_eIwLRhn-ygksD_i2dKU8vcG7GX3xIXbHUGMmVj5o17s7Tsz3ae8nNgDt5-qv-d6BRNqib2emknvmfu381-Q39doMF9p_5suf0mPq6UD3nW-8Vzl-4H9lzG9qpdbROqcCia3lGY1jTGXDQJZvD1Fk9XghKtePdMkVEjKqWHS1pnV3kjcyG1KvXjbEIoivrHNPXVH8StpWfrJj8ZMGe6Etc4pCfICD2thOMvNkeoNMXfZGzIUFdzJ_x_aseaZ7Xj1sasArBmhVvWx8tZwLyEca9zjGVX5kv1JCPAYPYi1emH6Y_4GB96fkj116bgsD1ivKBV2jy_-HjqfT7mf3ENY6xJp_Zv-HHlmOSndYdCS90EWkcvA_EYGnDDVTdpdHw46HS9OiBbyZf8WyybejuYmy3kySqUOefP2iMvAyDlS6tHyxlRzRN9sSdKsWRJnrhxtAi_g"
            }
        }).then(res => res.json()).then(res => {
            //console.log(result)
            var practiceReport =[];
            res.result.practiceReport.forEach(value =>{
                value.isChecked = false;
                practiceReport.push(value)
               // console.log(value)
            })
            console.log(practiceReport)
            this.setState({
                milestoneReport :res.result.milestoneReport,
                mileStoneValueReport :  res.result,
                mileStoneValueReport: { fileName : 'Milestone-value-report'},
                practiceReport : practiceReport,
                overallMileStoneValue : res.result.overallMileStoneValue,
                totalMileStoneValue : res.result.totalMileStoneValue,
                totalKickoffValue : res.result.totalKickoffValue,
                totalCarryValue : res.result.totalCarryValue,
                sumOfNotSureValue : res.result.sumOfNotSureValue,
                notUpdatedValue : res.result.notUpdatedValue,
                totalNewValue : res.result.totalNewValue,
                totalRaisedValue : res.result.totalRaisedValue,
                totalCollectedValue : res.result.totalCollectedValue,
                totalPendingValue : res.result.totalPendingValue,
                mileStoneReportMonth : res.result.monthName,
                mileStoneReportYear : res.result.year,
                filteredMilestoneData : res.result.milestoneReport
            })
            // console.log(this.state.filteredMilestoneData)
            // console.log(this.state.practiceReport)
           if(this.state.practiceReport.length > 0){
                this.calculatePracticeWiseMileStone(this.state.practiceReport);
           }
           if(this.state.filteredMilestoneData.length > 0){
            this.state.filteredMilestoneData.forEach(value =>{
                this.state.invoice_dropdown_value.forEach(invoice =>{
                    if(value.invoice_status == invoice.id){
                        value.invoice = invoice.value;
                    }
                })
            })
            console.log(this.state.filteredMilestoneData)
            this.filterPractice();
           }
        })
      
    }

   practiceRename =(practice) =>
    {
    var renamedPractice = practice;
    switch(practice)
    {
        case 'Mean':
        renamedPractice = 'ME';
        break;
        case 'Mobile':
        renamedPractice = 'MOB';
        break;
        case 'Java':
        renamedPractice = 'JV';
        break;
        case 'Python':
        renamedPractice = 'PY';
        break;
        case 'Mobile - RN':
        renamedPractice = 'M-R';
        break;
        case 'Finance':
        renamedPractice = 'FIN';
        break;
        case 'Java script':
        renamedPractice = 'JS';
        break;
        case 'Machine Learning':
        renamedPractice = 'ML';
        break;
        case 'others':
        renamedPractice = 'O';
        break;
        case 'Business Consulting':
        renamedPractice = 'BC';
        break;
        case 'WordPress':
        renamedPractice = 'WP';
        break;        
        case '.NET USEC':
        renamedPractice = '.N-U';
        break;     
        case 'Business Team':
        renamedPractice = 'BT';
        break;  
        case 'Business Team-BCG  1':
        renamedPractice = 'BT - 1';
        break;  
        case 'BI USEC':
        renamedPractice = 'BI-U';
        break;  
        case 'BT USEC':
        renamedPractice = 'BT-U';
        break;  
        case 'AX USEC':
        renamedPractice = 'AX-U';
        break;  
        case 'Techlead':
        renamedPractice = 'TL';
        break;  
        case 'MOBILE Android':
        renamedPractice = 'MA';
        break;  
        case 'Xamarin':
        renamedPractice = 'XM';
        break;  
        case 'Android':
        renamedPractice = 'AD';
        break;
        case 'DevOps':
        renamedPractice = 'DOP';
        break;
        case 'Data Labs':
        renamedPractice = 'DL';
        break;
        case 'Client Manager':
        renamedPractice = 'CM';
        break;
        case 'Flutter':
        renamedPractice = 'FL';
        break;
        case 'Zamarin':
        renamedPractice = 'ZM';
        break;
        case '3D Developer':
        renamedPractice = '3D-D';
        break;
        case '3D Artist':
        renamedPractice = '3D-A';
        break;
        case 'Data Annotation':
        renamedPractice = 'DA';
        break;
        case 'Cross Platform':
        renamedPractice = 'CP';
        break;
        case 'Talent Acquisition':
        renamedPractice = 'TA';
        break;
        case 'DataOps':
        renamedPractice = 'DOP';
        break;
        case 'OSDI':
        renamedPractice = 'OSDI';
        break;
        default:
        break;
    }
    return renamedPractice;
    }

       //for filtering service by head
    getReportByHead = (e) =>{
        console.log(e.target.value)
        this.setState({
            report:{
                head_id :e.target.value
            }
        })
        if(this.state.report.head_id != ''){ // for BU filter
            this.state.report.project_practice = [];
            this.state.report.service = [];
            var service_head = [];
            console.log("wel",e.target.value)
            console.log(this.state.sname1)
            this.state.sname1.forEach(service =>{
                if(e.target.value == service.bu){
                    service_head.push(service);
                    this.state.report_all_practices.forEach(prac_value =>{
                        if(service.id == prac_value.serviceId){
                            this.state.projectPractice.push(prac_value);
                        }
                    });
                }
            })
            this.state.sname = service_head;
        }else{ // when All BU is selected	
            this.state.sname = this.state.sname1;	
        }
        this.generateMileStoneValueReport(true);
        // if(self.scope.reports_lists[0].value == self.scope.current_report.value){
        //     self.scope.filterService(head_id);
        // }
        // else if(self.scope.reports_lists[1].value == self.scope.current_report.value || (self.scope.reports_lists[9].value == self.scope.current_report.value) || self.scope.reports_lists[10].value == self.scope.current_report.value){//foe inventory reports)
        //     self.scope.searchByPracticeHead = head_id;
        //     if(self.scope.report.start_date && self.scope.report.end_date){
        //         self.scope.submitted = false;
        //         self.scope.changeViewPracite_inventory(true);
        //     }else{
        //         self.scope.submitted = true;
        //     }
        // }
        // else if((self.scope.reports_lists[6].value == self.scope.current_report.value) || (self.scope.reports_lists[7].value == self.scope.current_report.value)){            
        //     if(self.scope.reports_lists[7].value == self.scope.current_report.value){
        //         self.scope.generateCollectionsReport(true);
        //     }else{
        //         self.scope.generateMileStoneValueReport(true);
        //     }
        // }
       
        // else if(self.scope.reports_lists[8].value == self.scope.current_report.value){
        //     self.scope.generateMileStoneValueReport(true);
        // }
    }

    msvalueSum = (e,data) => {
       
        console.log(data)
        data.isChecked = !data.isChecked;
        if(data.isChecked == true){
            this.state.SumofMileStoneValue += (data.userAchievedMilestoneValue) ? data.userAchievedMilestoneValue : data.userMilestoneValue;
        }
        else{
            this.state.SumofMileStoneValue -= (data.userAchievedMilestoneValue) ? data.userAchievedMilestoneValue : data.userMilestoneValue;
        }
        console.log(this.state.SumofMileStoneValue)
        this.setState({
            SumofMileStoneValue:this.state.SumofMileStoneValue
        })
    }
    /**
     * main render
     * @returns 
     */
	render() {
        const { current_report,reports_lists,sname,report,totalMileStoneValue,SumofMileStoneValue,
            totalKickoffValue,isChecked,
            totalCarryValue,myPracticeMileStone,allPracticeMileStone,practiceHead,
            filterMileStoneValue,report_service,invoice_dropdown_value,filteredMilestoneData,milestone_achieved_dropdown_value} = this.state;
            var index =0;
            var idx =0;
            const loginuserRole =1;
        
		return (
            
            <div style={{ width: "90%", margin: "0 auto" }}> 
                <Row className="fourty-fluid">
                    <div className="col-sm-4 col-xs-12">
                        <Col><h1 className="page-head">Reports</h1></Col>
                    </div>
                    <div className="col-lg-5 col-sm-5 col-xs-12">

                        <Col className="col-lg-5 col-sm-5 col-xs-12 header-icons-group" > 
                                
                        <select 
                            value={this.state.current_report} 
                            onChange={this.selectFilterMs} 
                        >
                        { 
                            reports_lists.map((list) =>(
                        <option value={`${list.value } `}>{list.value}</option>
                        ))
                        }      
                        </select>
                                
                        </Col>
                    </div> 
                </Row>
                <Row className="fourty-fluid">
                     <div className="col-sm-4 col-xs-4 clearfix m-b-20" >
                         {/* <div className="col-lg-12 clearfix teammembers--selectdrop m-t-5 p-l-0 m-b-5"> */}
                            <Col>
                            <label class="text-uppercase m-b-0 fs-13 p-t-5">Line of Service :</label>  &nbsp;&nbsp;
                                <select 
                                    value={this.state.report.service} 
                                    onChange={this.filterService} 
                                    name="service"
                                    required 
                                    autofocus="true"
                                >
                                { 
                                    sname.map((list) =>(
                                <option value={`${list.value } `}>{list.value}</option>
                                ))
                                }      
                                </select>
                                <div className="col-lg-2 p-0">
                                    <a href="javascript:void(0)" ng-if="report.service.length >0" uib-tooltip="Reset" tooltip-placement="top" className="reset-icon_old p-l-5 m-l-4" ng-click="reset_page()"><i class="fs-16 fa fa-refresh"></i></a>
                                </div> 
                             </Col>
                      </div>
                      <div className="col-sm-4 col-xs-4 clearfix m-b-20">      
                             <Col>
                              <label class="text-uppercase m-b-0 fs-13 p-t-5">Business Unit :</label>   &nbsp;&nbsp;      
                              <select 
                                    value={this.state.report.head_id} 
                                    onChange ={(e)=>this.getReportByHead(e)}                                  
                                    name="practice_head"
                                    required 
                                    autofocus="true"
                                >
                                { 
                                    practiceHead.map((list) =>(
                                <option value={`${list.bu } `}>{list.bu}</option>
                                ))
                                }      
                                </select>             
                               
                             </Col>
                    </div> 
                    <div className="col-sm-4 col-xs-12">
                       
                     </div>
                    {/* </div> */}
                </Row>
                <hr class="m-t-5 col-sm-12 m-b-8 p-0"></hr>   
                <div class="col-lg-12 col-sm-12 col-xs-12 p-b-15-xs p-r-15-xs">
                     <Row>
                        <Col>                  
                            <div className="form_date">
                                <label class="text-uppercase m-b-0 fs-13 p-t-5">Month :</label>   &nbsp;&nbsp;      
                                <Form.Control className="form_date" type="date" name='start_date' value={this.state.filter_start_date} onChange={(e)=>this.setStartDateForFilter(e)}   />                            
                            </div>      
                        </Col>
                        <Col>
                            <div className="form_date">
                                <Button onClick={this.generateMileStoneValueReport} value="Generate" >Generate</Button>&nbsp;&nbsp;
                            </div>
                        </Col>
                        <Col>
                            <div className="form_date">
                                <Button  value="Excel" >Export as Excel</Button>&nbsp;&nbsp;
                            </div>
                        </Col>
                         <Col>
                            <div className="form_date">
                                <Button  value="allpractice" >View all practice</Button>
                            </div>
                        </Col>
                        <Col> 
                            <div className="form_date">
                                <Button  value="mypractice" >View my practice</Button>
                            </div>
                        </Col>
                     </Row>                   
                </div>
                <hr class="m-t-5 col-sm-12 m-b-8 p-0"></hr>   
                <div className="center-block text-center">  
                    <div style={{ display: 'block',
                        width: 1000, padding: 30 }}>
                        <div className="col-lg-12 col-sm-12 col-xs-12 p-b-15-xs">
                            <h1  className="p-0 B-G-bold f-s-16 d-gray m-t-8 m-b-0 page-head">
                            <Container>
                                <Row>
                                    <Col style={{"font-size": "15px"}}><div>Expected MS Value: $ {this.state.totalMileStoneValue}</div></Col>
                                    <Col style={{"font-size": "15px"}}><div if="!filterByPractice">Kickoff Value: $ {this.state.totalKickoffValue}</div></Col>
                                    <Col style={{"font-size": "15px"}}> <div if="!filterByPractice">Carry Forward Value: $ {this.state.totalCarryValue}</div></Col>                               
                                    <Col xs="2"  style={{"font-size": "15px"}}>
                                        <div>
                                            <label class="text-uppercase m-b-0 fs-13 p-t-5">Invoice Status :</label>                                    
                                            <select 
                                                    value={ this.state.currentFilter.value} 
                                                    onChange={(e)=>this.selectFilter(e)}
                                                    name="invoice_status"
                                                    required 
                                                    autofocus="true"
                                                >
                                                { 
                                                    invoice_dropdown_value.map((list) =>(
                                                <option id ={list.id} value={list.value} >{list.value}</option>
                                                ))
                                                }      
                                            </select>                                
                                        </div>
                                     </Col>    
                                </Row>
                            </Container>
                            </h1>
                        </div>
                    </div>    
                </div>
                <div className="col-lg-12 col-sm-12 col-xs-12 p-b-15-xs">
                    <h1  className="p-0 B-G-bold f-s-16 d-gray m-t-8 m-b-0 page-head">
                     <Container>
                        <Row>
                        <Col style={{"font-size": "15px"}}> <div class="col-sm-6">Total Selected MS Value: $ {this.state.SumofMileStoneValue}</div></Col>
                        <Col style={{"font-size": "15px"}}>   <div class="col-sm-6 p-0">Total MS Value by practice: $ {this.state.sumoffilterMileStoneValue}</div>  </Col>       
                        </Row>
                    </Container>
                    </h1>
                </div>
                <hr className="m-t-5 col-sm-12 m-b-8 p-0"></hr>   
                <div className="col-lg-12 col-sm-12 col-xs-12 p-b-15-xs">    
                    <h3 className="col-sm-4" style={{"font-size": "18px"}}>My Practice</h3>
                    <Container>             
                    <Row>
                        <Col>
                        <div className="{'col-sm-1 p-0':this.state.mileStoneReportPractice !=0,'col-sm-4 p-0':this.state.mileStoneReportPractice==0}" onClick={(e)=>this.filterPractice(e)} >
                                    <div className="col-sm-12 p-l-0 p-r-5" className="{'active':!filterByPractice}">
                                        <p className="m-b-5 m-t-5 fs-12">All</p>
                                        <h3 className="fs-8" style={{"font-size": "15px"}}>$ {this.state.myPracticeMileStone }</h3>
                                        <hr className="m-t-7 m-b-0"></hr>
                                    </div>
                            </div>
                        </Col>
                        { this.state.practiceReport.map((practiceItem) => (
                            <Col>
                            <div className="{'col-sm-1 p-0':this.state.mileStoneReportPractice !=0,'col-sm-4 p-0':this.state.mileStoneReportPractice==0}">
                            <div className="col-sm-12 p-l-0 p-r-5" id="class_grey_row_" className="{'active':practiceItem.is_checked}">
                                <input type="checkbox" id="msvaluesum" value={practiceItem.practiceName}  style={{"float": "left","marginRight":"7px","verticalAlign":"top"}} onClick= {(e)=>this.filterPractice(e,practiceItem)}
                                />
                                <p class="m-b-5 m-t-5 fs-12 text-truncate" title={`${practiceItem.practiceName}`}>{practiceItem.practiceName}</p>
                                <h3 class="fs-14" style={{"font-size": "15px"}}>$ {practiceItem.mileStoneValue}</h3>
                                <hr class="m-t-7 m-b-0"></hr>
                            </div>
                            </div> 
                            </Col>
                        ))}
                       </Row>
                   </Container>
                </div>
                <hr className="m-t-5 col-sm-12 m-b-8 p-0"></hr>   
                <Container>
                  <Row>
                      <table className="table table-striped m-b-0 table-wrap">
                      <thead>
                        <tr className="theadInner">
                            <th className="" style={{"width": "1%"}}>#</th>
                            <th className="" style={{"width": "1%"}}>&nbsp;</th>
                            <th className="" style={{"width": "17%"}}>Project Name</th>
                            <th className="" style={{"width": "14%"}}>Milestone</th>
                            <th className="" style={{"width": "10%"}}>Allocated MS</th>                    
                            <th class="" style={{"width": "11%"}}>Achieved MS Value</th>                     
                            <th class="" style={{"width": "11%"}}>Invoice status</th>
                        </tr>
                      </thead>
                      <tbody>
                      { this.state.filteredMilestoneData.length == 0 &&
                        <tr>
                            <td colspan="8" class="r-no-data">No data available</td>
                        </tr>
                      }
                      { this.state.filteredMilestoneData.length > 0 && this.state.filteredMilestoneData.map((item) => (
                        <tr  id="class_grey_rows_" className="{'active':item.is_checked}" init="idx = $index">
                        <td>
                            {index++}
                        </td>
                        <td>
                          <input type="checkbox" id="msvaluesum_{{idx}}"  value={item.is_checked} onChange= {(e)=>this.msvalueSum(e,item)} />
                        </td> 
                        <td>                           
                            <span  title={`${item.practiceName}`}  className="t-t-upper practise-li python name p-l-5 text-truncate txt-black p-t-3 fs-13" style={{"float": "left"}}>{this.practiceRename(item.practiceName)}</span>
                            <Row>
                            <span className="name p-l-5 text-truncate txt-black p-t-3 fs-13" style={{"maxWidth": "200px","textAlign":"center"}} title={`${item.projectName}`}>{item.projectName}</span>
                            </Row>
                            <Row>
                            <span className="s-gray lead-name">{item.techLead} / {item.businessAnalyst}</span>
                            </Row>
                        </td>
                        <td>
                        <span>
                            { item.iterationNumber && !item.carryforward_targer && !item.is_carryforward && !item.iteration_name && 
                             <span>Sprint {item.iterationNumber}</span>
                            }
                            { item.iterationNumber && !item.carryforward_targer && !item.is_carryforward && item.iteration_name && 
                                <span ng-if="item.iteration_name">{item.iteration_name}</span>
                            }
                        </span>   
                        </td>
                        <td>
                          <span>${item.userMilestoneValue }</span>
                        </td>
                        <td >
                            {item.userAchievedMilestoneValue &&
                          <span class="{{msPercentageClass(item.userMilestoneValue, item.userAchievedMilestoneValue)}} m-t-5" >${item.userAchievedMilestoneValue }</span>}
                        </td>
                        <td ng-class="{'alert_report_row':((milestone_achieved_dropdown_value[2].id == item.invoice_status) || (milestone_achieved_dropdown_value[4].id == item.invoice_status)),'green_report_row':(milestone_achieved_dropdown_value[3].id == item.invoice_status)}">
                         {   item.invoice_status && this.state.currentFilter && 
                          <span >
                            <span class="pull-left">
                              <span uib-tooltip="Invoice NO: {{item.invoice_no}}" tooltip-placement="left">{item.invoice}</span></span>
                          </span>
                        }
                        {
                            !item.invoice_status &&
                          <span >NA</span>
                        }
                        </td>
                      </tr>
                      ))}</tbody>
                      </table>
                  </Row>
              </Container>
          </div>  
		);
	}
}


export default MileStoneReport;