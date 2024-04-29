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
                    bat 'docker build -t evaluation_${BUILD_ID} .'

                    // Tag and rename the Docker image
                    bat "docker tag evaluation_${BUILD_ID} amalseghaier/evaluation_${BUILD_ID}"
                }
            }
        }

        stage('Build and Run Docker Container') {
            steps {
                script {
                    // Run the Docker container
                    bat "docker run -d --name evaluation amalseghaier/evaluation_${BUILD_ID}"
                }
            }
        }
    }
}

