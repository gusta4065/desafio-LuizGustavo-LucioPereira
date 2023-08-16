import myjson from './desafio.json' // assert {type: 'json'} o assert faz n rodar os testes (?)
class CaixaDaLanchonete {
    
    calcularValorDaCompra(metodoDePagamento, itens) {
        const pymt = this.#getIdOfPayment(metodoDePagamento)
        if(pymt > 0){
            const result = this.#registerPurchase(itens)  // recebe uma tupla com [0] = mensagem [1] = total (resultado negativo caso operação invalida)
            if(result[1] < 0){ // verifica se o pedido foi efetuado corretamente
                return result[0]
            }else{
               const totalOrder = (this.#applyTaxes(pymt,result[1])).toFixed(2)
                return `R$ ${totalOrder}`.replace('.',',') //retorna valor da compra
            }

        }else{
            return "Forma de pagamento inválida!" // caso fforma de pagamaneto n exista
        }
    }
    #arrayOfPaymentsValues(){ // retorna um array com os metodos de pagamento
        const payMap = new Map(Object.entries(myjson.pagamento))
        return Array.from(payMap.values())
    }
    #arrayOfMenuKeys(){ // retorna um array com os itens do menu
        const menuMap = new Map(Object.entries(myjson.cardapio))
        return Array.from(menuMap.keys())
    }
    #getIdOfPayment(payment){ 
        /*
            retorna um numero de 1 a 3 onde cada numero se refere a um metodo de pagamento
            1 = dinheiro 2 = debito 3 = credito | 0 = caso n exista o metodo
        */
        return this.#arrayOfPaymentsValues().indexOf(payment) + 1
    }
    #getIdOfItem(item){ 
        /*
            retorna um numero de 1 a 7 onde cada numero se refere a um metodo de pagamento
            1 = cafe 2 = chantily 3 = suco 4 = sanduiche 5 = salgado 6 = queijo 7 = combo1 8 = combo2 | 0 = caso n exista o metodo
        */
        return this.#arrayOfMenuKeys().indexOf(item) + 1
    }
    #valueItemOrder(item){
        /*
        valida o valor do pedidido de um produto especifico multiplicado por sua quantidade
        */
        if(Number(item[1])===0){
            return -999999999999999
        } 
        const menuMap = new Map(Object.entries(myjson.cardapio))
        const orderUnitValue = menuMap.get(item[0])['preco']

        return orderUnitValue * Number(item[1])
    }

    #registerPurchase(orderArray){ // registra o pedido 
        if(orderArray.length > 0){
            const itensArray=[] // array com os pedidos computados
            let total = 0 // valor total da compra
            for(const _ of orderArray){
                let item = _.split(',') // divide celula de array em uma tupla com [0] nome do item [1] quantidade
                const itemId = this.#getIdOfItem(item[0]) //busca a id do item
                itensArray.push(item[0])
                if(itemId>0){
                    if(itemId === 2){ // confirmar se o item principal foi incluido
                        if(!itensArray.includes('cafe')){
                            return ['Item extra não pode ser pedido sem o principal',-1]
                        }
                    }
                    if(itemId === 6){ // confirmar se o item principal foi incluido
                        if(!itensArray.includes('sanduiche')){
                            return ['Item extra não pode ser pedido sem o principal',-1]
                        } 
                    }
                    total += this.#valueItemOrder(item) //incrementa valor da compra
                    if(total <0) return ['Quantidade inválida!',-1] // caso a quantidade seja 0
                }else{
                    return ['Item inválido!',-1] // caso item não exista
                }
            }
            return ['sucesso', total]
        }else{
            return ['Não há itens no carrinho de compra!',-1] // carrinho vazio
        }
    }

    #applyTaxes(payment,total){
        /*
         aplica um desconto ou juros a dependeder da forma de pagamento
         1 dinheiro
         2 debito
         3 credito
        */
        switch(payment){
            case 1:
                return total*0.95 //desconto
            case 2:
                return total
            case 3:
                return total*1.03 //juros
        }
    }

}

export { CaixaDaLanchonete };


/*
const myjson = {
    "cardapio": {
        
        "cafe": {
            "id": 1,
            "descrição": "Café",
            "preco": 3.00 
        },
        "chantily" : {
            "id": 2,
            "descrição": "Chantily(extra do café)",
            "preco": 1.50 
        },
        "suco" : {
            "id": 3,
            "descrição": "Suco natural",
            "preco": 6.20 
        },
        "sanduiche" : {
            "id": 4,
            "descrição": "Sanduíche",
            "preco": 6.50 
        },
        "salgado" : {
            "id": 5,
            "descrição": "Salgado",
            "preco": 7.25 
        },
        "queijo" : {
            "id": 6,
            "descrição": "Queijo(extra do Sanduíche)",
            "preco": 2.00 
        },
        "combo1" : {
            "id": 7,
            "descrição": "1 Suco e 1 Sanduíche",
            "preco": 9.50 
        },
        "combo2" : {
            "id": 8,
            "descrição": "1 café e 1 Sanduíche",
            "preco": 2.00 
        }

    },
    "pagamento": {
        "1": "dinheiro",
        "2": "debito",
        "3": "credito"        
    } 
}

*/
