import Head from 'next/head';
import React from'react';
import Link from 'next/link';
import { connect } from 'react-redux';
class  About extends React.Component {
    componentDidMount(){
        console.log("THIS COMPONENT HAS MOUNTED Firest")
    }

    click = ()=> {
        console.log("dispatching")
        this.props.dispatch({type: "TICK", payload: "I am the payload"})
        this.props.dispatch({type: "LOGINUSER", payload: "I am the payload"});
        
    }
    render() {
        return <>
            <Head>
                <title>About Steaman</title>
            </Head>
            <h1>Hello There from Jeremiah{this.props.tick}</h1>
            <button onClick={this.click}>Tickle Me</button>
            <Link href='/'>Back to Home</Link>
        </>
        
    }
}

// export async function getServerSideProps (){
//     console.log("GETTING SERVER SIDE PROPS 1")
//     wrapper.getServerSideProps(
//     ({store, req, res, ...etc}) => {
//         console.log('DISPATCHING AGAING');
//         store.dispatch({type: 'LOGINSUCCESS', payload: 'was set in other page'});
//     }
// );
// return {
//     props: {}, // will be passed to the page component as props
//   }
// }
// export const getServerSideProps = wrapper.getServerSideProps(
//     ({store, req, res, ...etc}) => {
//         console.log('2. Page.getServerSideProps uses the store to dispatch things');
//         // store.dispatch({type: 'TICK', payload: 'was set in other page'});
//     }
// );

export default About;

