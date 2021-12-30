import React, { Component } from 'react'
import Head from 'next/head'
// import localStorage from 'locals'
import {Button } from 'reactstrap'
import styles from '../styles/underdev.module.scss'
export default class UnderDev extends Component {
    componentDidMount(){
        // makeStore.dis
        console.log("MOUNTED", this.props)
    }

    // getStaticProps = wrapper.getStaticProps(({store, preview})=> {
    //         console.log("Successfully Logged In", store)
    //         store.dispatch("LOGINSUCCESS", {user: "Jeremiah"})
    //         console.log("GETTING PROPS")
    //     })
    // getInitialProps = ({store, pathname, req, res}) => {
    //     console.log('2. Page.getInitialProps uses the store to dispatch things');
    //     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
    // }

    
      
    render() {
        return (
            <>
            <Head>
                <title>Steman Home</title>
            </Head>
            <div className={`col-md-12 h-100 ${styles.underDev}`}  >
                <div className='row row align-items-center h-100'>
                    <div className='col'>
                <h1>Steaman Home</h1>
                </div>
                </div>
            </div>
            
            </>
        )
    }
}
// export async function  getStaticProps() {
//     // console.log("THIS IS ASYNC", store);
//     // store.dispatch("LOGINSUCCESS", {user: "Jeremiah"})
//     console.log("RENDERING")
//     // localStorage.setItem("email", "jlkwarteng@gmail.com")
// //    wrapper.getStaticProps(async ({store, preview})=> {
// //         store.dispatch("LOGINSUCCESS", {user: "Jeremiah"})
// //         console.log("THIS IS STORE", store);
// //     })
//     // console.log("THIS IS REPONSE", response)
//     return {
//         props: {name: "JEREMIAH", context: "THIS CON"}, // will be passed to the page component as props
//     }
// }
