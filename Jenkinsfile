pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${env.NODEJS_HOME}\\bin;${env.PATH}"
        CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Chemin vers l'exécutable Chrome
        DOCKER_HUB_REGISTRY = 'docker.io' // URL du registre Docker Hub
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat "${NODEJS_HOME}\\bin\\npm install"
                // bat "${NODEJS_HOME}\\bin\\npm install jest --save-dev"
                // bat "${NODEJS_HOME}\\bin\\npm install bcrypt"
            }
        }

        stage('Fix Permissions') {
            steps {
                // Fixer les permissions pour le répertoire du projet et node_modules
                bat 'icacls . /grant "Tout le monde:(OI)(CI)(F)" /T /Q'
            }
        }

        stage('Build') {
            steps {
                // bat 'node app.js'
                bat 'npm run build'
            }
        }

        // stage('Test') {
        //     steps {
        //         // Exécuter les tests Jest
        //         bat 'npm test'
        //     }
        // }

        stage('Build Docker image') {
            steps {
                bat 'docker build -t amalseghaier/user:latest Dockerfile .'
                // Taguer l'image Docker avec une version
                bat 'docker tag user:latest amalseghaier/user:latest'
            }
        }

        stage('Deploy Docker image') {
            steps {
                script {
                    // Pousser l'image Docker vers Docker Hub
                    withCredentials([string(credentialsId: 'token', variable: 'DOCKER_TOKEN')]) {
                        docker.withRegistry('https://index.docker.io/v1/', '12') {
                            // Pousser à la fois les images latest et taguées
                            docker.image('amalseghaier/user:latest').push('latest')
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build réussi!'
            // Ajouter ici les actions post-build en cas de succès
        }

        failure {
            echo 'Build échoué!'
            // Ajouter ici les actions post-build en cas d'échec
        }
    }
}
