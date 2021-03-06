import React from "react";
//import { Welcome } from "./sample/Welcome";
import "./styles.css";
import {AiOutlineSend} from "react-icons/ai";
import {BsHandThumbsUp} from "react-icons/bs";
import {ImCheckmark,ImCross} from "react-icons/im";
//import { useTeamsFx } from "./sample/lib/useTeamsFx";
import { TeamsUserCredential } from "@microsoft/teamsfx";

class Tab extends React.Component {

   constructor(props) {
    super(props);
    this.state = {
      show : false,
      newQues : null,
      newAns : null,
      user : null,
      qna: [],
      isLoaded : false,
      quesIdMap : new Map(),
    };
   
  }

  componentDidMount () {

            fetch('https://teamsquestions.azurewebsites.net/questions/all')
            .then(response => {
              //console.log("Get response : " + response.json());
              response.json().then(data => {
                console.log("json res : " + data);
                let qnaData = JSON.stringify(data);
                console.log("qnaData length : " + qnaData.length);
                this.setState({qna : data});
                this.setState({isLoaded : true});
              })
            })
            .catch(error => console.log(error));  
            
             //const { isInTeams } = useTeamsFx();
              const credential = new TeamsUserCredential();
              credential.getUserInfo().then(result => {
                console.log("User Info : " + JSON.stringify(result));
                this.setState({user : result.preferredUserName});
              });
  }

  componentDidUpdate(prevProps, prevState) {

    fetch('https://teamsquestions.azurewebsites.net/questions/all')
            .then(response => {
              response.json().then(data => {
                let qnaData = JSON.stringify(data);
                console.log("Did Update qnaData length : " + qnaData.length);
                this.setState({qna : data});
                this.setState({isLoaded : true});
              })
            })
            .catch(error => console.log(error)); 
  }

  onSubmit = () => {
        fetch('https://teamsquestions.azurewebsites.net/question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body : JSON.stringify({ "questDesc" : this.state.newQues,
                    "user" : this.state.user,
                    })
            })
            .then(response => {
              this.setState({newQues : ""});
              console.log(" post response : " + response); 
            });
  }

  render() {
  if(this.state.isLoaded) {
  return (
    <>
    <div className="app">
      <div className="accordian">
      {this.state.qna.map((value, index) => {
        console.log(JSON.stringify(this.state.qna[index]));
        if(value.user == null) {
          value.user = "hmamidi@microsoft.com"; 
        }
         return (<div>
           <div className="usertimestamp" >
             <div className="left">{value.user.substr(0,value.user.indexOf("@"))}</div>
             <div className="right">{(new Date(value.timeStamp)).toGMTString()}</div>
            </div>
            <div className="accord">
           <div className="accordian-header" onClick={() => {
           console.log("clicked : " + index);
           let qId = value.questionId;
           let quesIdMap = this.state.quesIdMap;

           if(quesIdMap.has(qId)) {
              let mapValue = quesIdMap.get(qId);
              console.log("map Value : " + JSON.stringify(mapValue));
              if(mapValue.show) {
                mapValue.show = false;
              } else {
                mapValue.show = true;
              }
              quesIdMap.set(qId, mapValue);
           } else {
            quesIdMap.set(qId, {
              show : false,
              isNewAns : false,
              });
           }
           this.setState({quesIdMap : quesIdMap});
         }}>
         <div>{value.questDesc}</div>  
         <div className="sign">{(this.state.quesIdMap.has(value.questionId) && ((this.state.quesIdMap.get(value.questionId)).show)) ? '-' : '+'}</div> 
       </div>
       <BsHandThumbsUp size="20px" onClick={() => {
          let upvoteSet = new Set(value.upvotedBy);
          if(!upvoteSet.has(this.state.user)) {
            fetch('https://teamsquestions.azurewebsites.net/question/'
            + value.questionId + '/upvote/' + this.state.user, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json;charset=utf-8'
                },
                })
                .then(response => {
                console.log("upvote post response : " + response); 
                });
          }
       }} />
       <div>{value.upvotedBy.length}</div>
       </div>
       {(this.state.quesIdMap.has(value.questionId) &&
        ((this.state.quesIdMap.get(value.questionId)).show)) && (
        <> {value.answers.map((ans, index) => {
          return (<>
          <div className="usertimestamp" >
          <div className="left">{ans.user.substr(0,ans.user.indexOf("@"))}</div>
          <div className="right">{(new Date(ans.timeStamp)).toGMTString()}</div>
          </div>
          <div className="accordian-body">
          {ans.answer}
        </div>
        </> );
        })}
        {!(this.state.quesIdMap.get(value.questionId)).isNewAns &&<button className="add-answer" onClick={()=> {
           
           let quesIdMap = this.state.quesIdMap;
           if(!quesIdMap.get(value.questionId).isNewAns) {
            quesIdMap.get(value.questionId).isNewAns = true;
           }          
           this.setState({quesIdMap : quesIdMap});
        }}>+ Add answer</button> }
        {(this.state.quesIdMap.get(value.questionId)).isNewAns && (
          <>
                 <textarea className="answer" value={this.state.newAns}
                 onChange={e => {
                   this.setState({newAns : e.target.value});
                 }}
                     placeholder=" Pls enter your answer here" name="Answer"/>
                     <button className="ansbutton" onClick={() => {

                        fetch('https://teamsquestions.azurewebsites.net/question/'
                         + value.questionId + '/answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body : JSON.stringify({ user : this.state.user,
            answer : this.state.newAns,
            })
            })
            .then(response => {
              let quesIdMap = this.state.quesIdMap;
              quesIdMap.get(value.questionId).isNewAns = false;
              this.setState({quesIdMap : quesIdMap});
              this.setState({newAns : ""});
              console.log(" post response : " + response); 
            });
                     }}>
          <ImCheckmark /></button>
          <button className="ansbutton" onClick={() => {
              let quesIdMap = this.state.quesIdMap;
              quesIdMap.get(value.questionId).isNewAns = false;
              this.setState({quesIdMap : quesIdMap});
          }}>
          <ImCross/></button>
          </>
        )}
      </> )}
      </div>
        );
      })}
   </div>
   </div>
   <div className="chat-box">
   <textarea className="textbox" type="text" value={this.state.newQues}
    onChange={e => {
      this.setState({newQues : e.target.value});
    }}
        placeholder=" Pls enter your question here" name="Name"/>
    <AiOutlineSend size="30px" onClick={this.onSubmit} className="button" />
   </div>
   </>

  );
  } else {
    return (<div> Loading </div>);
  }
 }
}

export default Tab;