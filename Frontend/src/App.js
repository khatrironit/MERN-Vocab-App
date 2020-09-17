import React, { Component } from 'react'
import {Button, Modal,Container, Row, Col, Form} from 'react-bootstrap';
import * as Fab from 'react-floating-action-button'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import axios from 'axios'

import WordCard from './components/WordCard'


export default class App extends Component {
  constructor(){
    super()
    this.state = {
      dictionary : [],
      searchvisible : false,
      searchInput : "",
      showDialogBox : false,
      word : "",
      error : "",
    }
  }
  async componentDidMount(){
    const url = "http://localhost:5000/home"
    await axios.get(url).then(res=>{
      console.log(res)
      this.setState({dictionary : res.data})
    }).catch(err=>{
      console.log(err)
    })
  }
  toggleSearch = () => {
    this.setState((prevState)=>({searchvisible : !prevState.searchvisible}))
  }
  setInputValue = (event,key) => {
    this.setState({ [key]: event.target.value });
  }
  addWord = () => {
    this.setState({ showDialogBox: true });
  }
  validateForm = () => {
    if(this.state.word === ""){
      this.setState({error : "Please Enter a Word"})
    }else{
      this.searchApi();
    }
  }
  searchApi = async () => {
    const { word } = this.state


    const url = "http://localhost:5000/add/" + word
    
     await axios.post(url,{}).then(res => {
      console.log(res.data)
      if(res.data!=="success"){
        this.setState({error : "Something Went Wrong. Please Try Again"})
      }else{
        this.setState({ showDialogBox: false });
      }
    }).catch(err=>this.setState({error : "Something Went Wrong. Please Try Again"}))
  }
  renderWordCards = () => {
    const { dictionary, searchInput } = this.state

    const filteredwords = dictionary.filter(
      (word) => {
        if(word.word !== undefined)
          return word.word.indexOf(searchInput) !== -1 ;
      }
    )
    return filteredwords.map((data,index)=><WordCard key = { index } data = { data } />)

  }
  render() {
    const { searchvisible, dictionary } = this.state
    return (
      <div className="App">
       <Container className = "topbar" fluid>
        <Row className = "topbar-row">
            <Col xl = {6} lg = {6} md = {6} sm = {6} xs = {6} className = "title">
              <h2 className = "title-heading">Vocab</h2>
            </Col>
            <Col  xl = {5} lg = {5} md = {5} sm = {5} xs = {5} className = "searchbar">
              {searchvisible ?
               <input type = "text"
                      className = "search" 
                      placeholder = "Search..."
                      onChange = {(e)=>this.setInputValue(e,"searchInput")}
                      onBlur = {this.toggleSearch}></input>: 
               <i className="fa fa-search search-icon" aria-hidden="true" onClick = {this.toggleSearch}></i>}
            </Col>
          </Row>
       </Container>
       <Container className = "body" fluid>
          <Row >
            <Col style = {{borderBottom : '0.1px solid grey',boxSizing : 'border-box',marginBottom : '0'}}>
                <p className = "sub-title">Words List</p>
            </Col>
          </Row>
          <br />
          <Row>
            {this.renderWordCards()}
                {/* {dictionary.length > 0 ? dictionary.map((data,index)=><WordCard key = {index} data = {data} />) : null} */}
          </Row>
       </Container>

       <Modal 
            size="md"
            show={this.state.showDialogBox} 
            animation={false} 
            onHide={()=>this.setState({ showDialogBox: false })}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Add New Word</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Word *</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter New Word..."
                                value={this.state.name}
                                onChange={(event)=>this.setInputValue(event,"word")}
                                onFocus = {()=>this.setState({error:""})}
                            />
                        </Form.Group>
                    </Col>
                </Row>                       
                {
                    this.state.error?
                    <Row className="text-center mt-1 mb-1 d-flex justify-content-center">
                        <Col style={{ color: "red" }}>
                            {this.state.error}
                        </Col>
                    </Row>
                    :
                    <Row className="text-center mt-1 mb-1 d-flex justify-content-center">
                        <Col>
                            Fields marked * are mandatory
                        </Col>
                    </Row>
                }
            </Modal.Body>

            <Modal.Footer className="text-center mb-3 d-flex justify-content-center">
                <Button 
                    style={{ width: "30%",backgroundColor : '#5c1349',border:'none' }} 
                    className="pt-2 pb-2" 
                    variant="primary"
                    onClick={()=>this.validateForm()}
                >
                    Add
                </Button>
            </Modal.Footer>
        </Modal>

       <Fab.Container>
                    <Fab.Button
                        styles={{backgroundColor: '#5c1349', color: Fab.lightColors.white, width: 60, height: 60 }}
                        tooltip="Add New CV"
                        icon="fa fa-plus"
                        onClick={()=>this.addWord()}
                        className="btn-block z-depth-1a"
                    />
                </Fab.Container>
      </div>
    )
  }
}
