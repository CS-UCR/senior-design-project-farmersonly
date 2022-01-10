import React, { useRef } from 'react'
import {Form, Button, Card, Container} from 'react-bootstrap'
import styles from '../../styles/signup.module.css'
import { useAuth } from "/contexts/AuthContext"
import { signInWithPopup } from 'firebase/auth'

export default function signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {signup} = useAuth() 

    function handleSubmit(e) {
        e.preventDefault()

        signup(emailRef.current.value, passwordRef.current.value)
    }

    return (
        <Container className = {styles.container} style={{minHeight:"100vh"}}>
            <div className = "w-100" style={{maxWidth: "400px"}}>
                <Card>
                    <h2 className = "text-center mb-4">
                        Sign Up
                    </h2>
                    <Form>
                        <Form.Group id = "email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type = "email" ref = {emailRef} required />
                        </Form.Group>
                        <Form.Group id = "password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type = "password" ref = {passwordRef} required />
                        </Form.Group>
                        <Form.Group id = "password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type = "password" ref = {passwordConfirmRef} required />
                        </Form.Group>
                        <Button className = "w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card>
                <div className = "w-100 text-center mt-2">
                    Already have an account? Log In
                </div>
            </div>
        </Container>
    )
}
