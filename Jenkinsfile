pipeline {
    agent any

    environment {
        DOCKER_PATH = "C:\\Program Files\\Docker\\cli-plugins"
        PATH = "${DOCKER_PATH}:${PATH}"
        // DOCKERHUB_CREDENTIALS = credentials('DockerHub')
        NODEJS_PATH = "C:\\Program Files (x86)\\nodejs"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Build and Rename Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    bat 'docker build -t amalseghaier/evaluation:latest .'

                    // Tag the Docker image
                    bat 'docker tag amalseghaier/evaluation:latest amalseghaier/evaluation:release'
                }
            }
        }

        stage('Build and Run Docker Container') {
            steps {
                script {
                    // Run the Docker container
                    bat 'docker run -d --name evaluation -p 8000:80 amalseghaier/evaluation:release'
                }
            }
        }
    }
}


