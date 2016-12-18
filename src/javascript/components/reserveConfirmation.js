var React         = require("react");
var Business = require("../business");


var ReserveConfirmation =  React.createClass({

  render: function(){
    return <div>

    <p><small>Recuerde que no somos un retreat. Somos un grupo de voluntarios que nos organizamos para que la ceremonia pueda suceder. Esto es entre amigos.</small></p>

    <strong>Su reservación esta sin confirmar</strong>
    <p>Para confirmar su reservación:</p>

     <ul>
       <li>Deposite el monto de ${this.props.record.monto}</li>
       <li>Ingrese su numero celular en el detalle del deposito</li>
     </ul>

     <h5>Instrucciones del Deposito</h5>

     <ul>
       <li>Cuenta: 1511837383738</li>
       <li>Cedula: 13447788</li>
       <li>Monto: ${this.props.record.monto}</li>
       <li>Concepto: {this.props.record.celular}</li>
     </ul>

     <p><strong>Recuerde el concepto o descripcion debe ser solamente su celular.</strong>
      <br/><small>No hace falta su nombre, email. Solamente su celular.</small></p>

     <h4>Preguntas Frecuentes</h4>
     <p><strong>Puedo depositar el 50%?</strong><br/>Si puede. Solo recuerde que debe realizar el pago completo 3 semanas antes de la ceremonia. Tres semanas antes de la cermonia se empezaran a confirmar reservacion en la manera que se van haciendo. Si no realiza el pago completo, es posible que pierda su campo.</p>

     <p><strong>Que pasa luego de depositar?</strong><br/>Procesamos los depositos en la noche, al dia siguiente su reservacion aparecera en <strong>Confirmados</strong>, el link se encuetra en la parte superior de esta pagina.</p>

     <p><strong>Cuanto tiempo tengo para depositar?</strong><br/>3 Dias luego de hacer la reservacion. <strong>Las reservaciones sin deposito</strong> sera borradas a los tres dias, si no realiza el deposito en ese lapso debera volver a reservar.</p>

     <p><strong>Que pasa si deposito luego de tres dias?</strong><br/>No se puede, puesto que su reservacion ya habria sido cancelada. Debe realizar una reservacion nueva.</p>

     <p><strong>Como se que estoy confirmado?</strong><br/>En la parte superior de esta pagina, en el link Confirmados. Esta es la lista oficial de reservaciones y el estado de cada una.</p>

     <p><strong>Aparecera mi nombre en la lista de confirmados?</strong><br/>No, solamente mostramos 5 digitos de su celular. De esa forma solo usted podra comprobarlo.</p>

     <p><strong>Puedo cancelar mi reservacion?</strong><br/>Si claro con tiempo. Avisenos y le devolveremos el dinero. Si cancela una semana antes o menos, solo le podremos devolver el 50% de su pago y lo podemos hacer la semana siguiente de la ceremonia.</p>

    </div>
  }
});

module.exports = ReserveConfirmation;
