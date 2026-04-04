describe('Funcionalidade: Administrar Reservas de livros', () => {

    beforeEach(() => {
        //  cy.loginApp('usuario@teste.com', 'user123')
        cy.loginToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NzUzNDYyNzgsImV4cCI6MTc3NTM3NTA3OH0.NaZkQjOh1fG-yQqFZPlZxLGO221AmD2tRSKEIxMU2cM")
    });

    it('Deve exibir as reservas via intercept', () => {
        cy.fixture('reservas').then((dadosReserva) => {
            cy.intercept('GET', 'api/reservations', {
                statusCode: 200,
                body: dadosReserva
            }).as('listarReservas')

            cy.visit('dashboard.html')
            cy.wait('@listarReservas')

        })


    });

});