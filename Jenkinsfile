pipeline {
    agent any
    environment {
        DOCKER_PATH = "C:\\Program Files\\Docker\\cli-plugins"
        PATH = "${DOCKER_PATH}:${PATH}"
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
                    // Construire l'image Docker
                    bat 'docker build -t amalseghaier/evaluation:%BUILD_ID% .'

                    // Renommer l'image Docker
                    bat "docker tag amalseghaier/evaluation:%BUILD_ID% amalseghaier/evaluation:latest"
                }
            }
        }

        stage('Build and Run Docker Container') {
            steps {
                script {
                    // Exécuter le conteneur Docker
                    bat "docker run -d --name evaluation amalseghaier/evaluation:latest"
                }
            }
        }
    }
}

            echo 'Build failed!'
            // Add any failure post-build actions here
        }
    }
}
