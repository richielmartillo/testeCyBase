/// <reference types="cypress" />

describe('Login no hub de leitura', () => {
    beforeEach(() => {
        cy.visit('login.html')
        cy.setCookie('jwt_education_shown', 'true')
    })

    it('Deve fazer login com sucesso com usuário comum - sem app actions', () => {
        cy.login('usuario@teste.com', 'user123')
        cy.get('h4').should('contain', 'Olá')
    })

    it('Deve fazer login com sucesso com usuário comum - via api', () => {
        cy.request({
            method: 'POST',
            url: 'api/login',
            body: {
                email: 'usuario@teste.com',
                password: 'user123',
            },
        }).then((response) => {
            expect(response.status).to.equal(200)
            // Criar o estado da aplicação
            window.localStorage.setItem('authToken', response.body.token)
            window.localStorage.setItem('isAdmin', String(response.body.isAdmin))
            window.localStorage.setItem('userEmail', response.body.token)
            window.localStorage.setItem('userId', String(response.body.id))
            window.localStorage.setItem('userId', response.body.name)
            cy.visit('dashboard.html')
            cy.get('h4').should('contain', 'Olá')
        })
    })

    it.only('Deve fazer login com sucesso com usuário comúm - setando token', () => {
        let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NzUxNjYxNjMsImV4cCI6MTc3NTE5NDk2M30.jKdqmxmBymkxVXm5QRMcO-ZfPtf-7F0YrwAq86jlVv4"
        window.localStorage.setItem('authToken', token)
        cy.visit('dashboard.html')
        cy.get('h4').should('contain', 'Olá')

    });

    it('Deve fazer login com sucesso com usuário admin - usando comando customizado', () => {
        cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
        cy.get('h1').should('contain', 'Painel Administrativo')
    })

    it('Deve fazer login com sucesso com usuário comum - usando intercept', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 200,
            body: {
                token: 'token123',
                name: 'Usuário de teste',
            },
        }).as('loginMock')

        cy.login('usuario@usuario.com', 'testeuser123')
        cy.wait('@loginMock')
        cy.get('h4').should('contain', 'Olá')
    })

    it('Deve simular um erro do servidor - usando intercept', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 500,
        }).as('erroServer')
        cy.loginErro('usuario@teste.com', 'user123')
        cy.wait('@erroServer')
        cy.get('#alert-container').should(
            'contain',
            'Erro de conexão. Tente novamente.',
        )
    })

    it('Deve simular um erro do cliente - usando intercept', () => {
        cy.intercept('POST', 'api/login', {
            statusCode: 400,
            body: { erro: 'erro do cliente' },
        }).as('erroClient')
        cy.login('usuario@teste.com', 'user123', false)
        cy.wait('@erroClient')
        cy.get('#alert-container').should('contain', 'Erro ao fazer login')
    })
})
