import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { addHours, differenceInSeconds } from 'date-fns';
import  DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import { useCalendarStore, useUiStore } from '../../hooks';

registerLocale( 'es', es );

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root'); // ayuda a que se pueda sobreponer ante todo

export const CalendarModal = () => {

    // Estado de nuestro custom hook
    const { isDateModalOpen, closeDateModal } = useUiStore();

    const { activeEvent, startSavingEvent } = useCalendarStore();

    //nuevo estado para cuando se ingrese el evento
    const [ formSubmitted, setFormSubmitted ] = useState(false);

    const [ formValues, SetFormValues ] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours ( new Date(), 2)
    });

    //Utilizamos el useMemo
    const titleClass = useMemo(() => {
        if( !formSubmitted) return '';

        return ( formValues.title.length > 0) ? 'is-valid' : 'is-invalid'
    }, [ formValues.title, formSubmitted ])

    useEffect( () => {
        if ( activeEvent !== null ) {
            SetFormValues({ ...activeEvent })
        }
    }, [ activeEvent ] );

    const onInputChanged = ({ target }) => {
        SetFormValues({
            ...formValues,
            [target.name ]: target.value
        })
    }

    const onDateChanged = (event, changing) => {
        SetFormValues({
            ...formValues,
            [ changing ]: event
        })
    }


    const onCloseModal = () => {
        closeDateModal();
    }
    
    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds( formValues.end, formValues.start );
        
        if ( isNaN( difference ) || difference <= 0 ) {
            Swal.fire('Fechas incorrectas', 'Por favor revisa las fechas ingresadas', 'error');
            return;
        }

        if ( formValues.title.length <= 0) {
            console.log('Es necesario indicar un titulo al evento')
            return;
        }

        console.log(formValues)

        await startSavingEvent( formValues );

        closeDateModal();
        setFormSubmitted(false);
    }

    return (
        <Modal
          isOpen={ isDateModalOpen }
          onRequestClose={ onCloseModal }
          style={customStyles}
          
          className='modal'
          overlayClassName='modal-fondo'
          closeTimeoutMS={ 200 }
        >
            <h2>Nuevo Evento</h2>
            <hr />
            <form className='container' onSubmit={ onSubmit }>
                <div className='form-group mb-2'>
                    <label>Fecha y hora de inicio</label>
                    <DatePicker 
                        selected={ formValues.start } 
                        className='form-control' 
                        onChange={ (event) => onDateChanged(event, 'start')}
                        dateFormat='Pp'
                        showTimeSelect
                        locale='es'
                        timeCaption='Hora'
                    />
                </div>
                <div className='form-group mb-2'>
                    <label>Fecha y hora de fin</label>
                    <DatePicker 
                        minDate={ formValues.start }
                        selected={ formValues.end }
                        className='form-control' 
                        onChange={ (event) => onDateChanged(event, 'end')}
                        dateFormat='Pp'
                        showTimeSelect
                        locale='es'
                        timeCaption='Hora'
                    />
                </div>

                <hr />

                <div className='form-group mb-2'>
                    <label>Titulo y notas</label>
                    <input 
                        type="text"
                        className={`form-control ${ titleClass }`}
                        placeholder='Titulo del evento'
                        autoComplete='off'
                        name='title'

                        value={ formValues.title }
                        onChange={ onInputChanged }
                    />
                    <small className='form-text text-muted'> Una description corta</small>
                </div>

                <div className='form-group mb-2'>
                    <textarea
                        type='text'
                        className='form-control'
                        placeholder='Notas'
                        rows='5'
                        name='notes'

                        value={ formValues.notes }
                        onChange={ onInputChanged }
                    >

                    </textarea>
                    <small className='form-text text-muted'> Informacion Adicional</small>
                </div>

                <button
                    type='submit' 
                    className='btn btn-outline-primary btn-block'
                >
                    <i className='far fa-save'></i>
                    &nbsp;
                    <span>Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
