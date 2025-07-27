import React from 'react'
import { useForm } from 'react-hook-form'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import { loginSchema } from '../../../validations/authenticationSchema.jsx'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { Mail, LockKeyhole, User, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(loginSchema)

const Login = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm()

  const [generalMessage, setgeneralMessage] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const watchedFields = watch()

  // Limpia el mensaje general cuando cambian inputs
  React.useEffect(() => {
    if (watchedFields) {
      setgeneralMessage('')
    }
  }, [watchedFields])

  // Mostrar errores con toast cuando cambian
  React.useEffect(() => {
    // Mostrar errores específicos de campos
    Object.values(errors).forEach((err) => {
      toast.error(err.message, { autoClose: 4000 })
    })
  }, [errors])

  // Mostrar mensaje general con toast cuando cambia
  React.useEffect(() => {
    if (generalMessage) {
      toast.error(generalMessage, {
        autoClose: 5000,
        onClose: () => setgeneralMessage(''),
      })
    }
  }, [generalMessage])

  const onSubmit = async (data) => {
    const valid = validate(data)
    if (!valid) {
      validate.errors.forEach((err) => {
        const field = err.instancePath.replace('/', '')
        setError(field, { type: 'manual', message: err.message })
      })
      return
    }

    try {
      if (data.role === 'admin') {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, data, {
          withCredentials: true,
        })
        setgeneralMessage('')
        toast.success('¡Inicio de sesión exitoso!')
        navigate('/modulos')
      } else if (data.role === 'docente') {
        await axios.post(`${import.meta.env.VITE_API_URL}/docente/login`, data, {
          withCredentials: true,
        })
        setgeneralMessage('')
        toast.success('¡Inicio de sesión exitoso!')
        navigate('/modulos')
      } else if (data.role === 'estudiante') {
        await axios.post(`${import.meta.env.VITE_API_URL}/estudiante/login`, data, {
          withCredentials: true,
        })
        setgeneralMessage('')
        toast.success('¡Inicio de sesión exitoso!')
        navigate('/modulos')
      }
    } catch (error) {
      setgeneralMessage(error.response?.data?.message || 'Error en el inicio de sesión')
    }
  }

  return (
    <div className="bg-esfot min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center ">
          <CCol lg={5} md={9} >
            <CCardGroup>
              <CCardBody className="p-4 bg-white">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <CRow>
                    <CCol md={12} className="text-center">
                      <h1 className="titulos-esfot">Iniciar Sesión</h1>
                      <p className="subtitulos-esfot">
                        Sistema de Gestión de Reservas de Aulas y Laboratorios
                      </p>
                    </CCol>
                    <CCol md={12} className="text-center mb-3">
                      <img
                        src="https://esfot.epn.edu.ec/images/logo_esfot_buho.png"
                        alt="Logo"
                        style={{ width: '50%', maxWidth: '200px', height: 'auto' }}
                      />
                    </CCol>
                  </CRow>

                  <CInputGroup className={`mb-3 ${errors.email ? 'is-invalid' : ''}`}>
                    <CInputGroupText
                      className={`${errors.email ? 'border-danger bg-danger' : 'text-white bg-esfot'
                        }`}
                    >
                      <Mail className={`${errors.email}` ? 'text-white' : ''}/>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Correo Electrónico"
                      autoComplete="email"
                      className={`custom-input ${errors.email ? 'border-danger' : ''
                        }`}
                      invalid={!!errors.email}
                      {...register('email')}
                    />
                  </CInputGroup>

                  <CInputGroup className={`mb-3 ${errors.password ? 'is-invalid' : ''}`}>
                    <CInputGroupText
                      className={`${errors.password ? 'border-danger bg-danger' : 'text-white bg-esfot'
                        }`}
                    >
                      <LockKeyhole  className={`${errors.password}` ? 'text-white' : ''}/>
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      autoComplete="current-password"
                      className={`custom-input ${errors.password ? 'border-danger' : ''
                        }`}
                      invalid={!!errors.password}
                      {...register('password')}
                    />
                    <CInputGroupText
                      className={` ${errors.password ? 'border-danger bg-danger' : 'text-white bg-esfot'
                        }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff  className={`${errors.password}` ? 'text-white' : ''}/> : <Eye  className={`${errors.password}` ? 'text-white' : ''}/>}
                    </CInputGroupText>
                  </CInputGroup>

                  <CInputGroup className={`mb-4 ${errors.role ? 'is-invalid' : ''}`}>
                    <CInputGroupText
                      className={`${errors.role ? 'border-danger bg-danger' : 'text-white bg-esfot'
                        }`}
                    >
                      <User  className={`${errors.role}` ? 'text-white' : ''}/>
                    </CInputGroupText>
                    <CFormSelect
                      className={`text-secondary custom-input ${errors.role ? 'border-danger' : ''
                        }`}
                      invalid={!!errors.role}
                      {...register('role')}
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="admin">Administrador</option>
                      <option value="docente">Docente</option>
                      <option value="estudiante">Estudiante</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CRow>
                    <CCol md={6} xs={12} className="text-md-start text-center">
                      <CButton type="submit" className="btn-esfot px-4">
                        Iniciar Sesión
                      </CButton>
                    </CCol>
                    <CCol md={6} xs={12} className="text-md-end text-center">
                      <CButton
                        color="link"
                        className="px-0 text-secondary"
                        to="/recuperar-contrasena"
                        as={NavLink}
                      >
                        ¿Olvidaste tu contraseña?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
