using System;
using System.Xml.Serialization;
using System.Collections;
using System.Xml.Schema;
using System.ComponentModel;
using general.xml;

/// <summary>
/// Entidad de factura
/// </summary>

namespace facturacionelectronica.comp.consulta.esquemasri.documentos.factura
{

	public struct Declarations
	{
		public const string SchemaVersion = "";
	}

	[Serializable]
	public enum id
	{
		[XmlEnum(Name="comprobante")] comprobante
	}

	[Serializable]
	public enum obligadoContabilidad
	{
		[XmlEnum(Name="SI")] SI,
		[XmlEnum(Name="NO")] NO
	}


	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class totalImpuestoCollection : ArrayList
	{
		public totalImpuesto Add(totalImpuesto obj)
		{
			base.Add(obj);
			return obj;
		}

		public totalImpuesto Add()
		{
			return Add(new totalImpuesto());
		}

		public void Insert(int index, totalImpuesto obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(totalImpuesto obj)
		{
			base.Remove(obj);
		}

		new public totalImpuesto this[int index]
		{
			get { return (totalImpuesto) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class detAdicionalCollection : ArrayList
	{
		public detAdicional Add(detAdicional obj)
		{
			base.Add(obj);
			return obj;
		}

		public detAdicional Add()
		{
			return Add(new detAdicional());
		}

		public void Insert(int index, detAdicional obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(detAdicional obj)
		{
			base.Remove(obj);
		}

		new public detAdicional this[int index]
		{
			get { return (detAdicional) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class retencionCollection : ArrayList
	{
		public retencion Add(retencion obj)
		{
			base.Add(obj);
			return obj;
		}

		public retencion Add()
		{
			return Add(new retencion());
		}

		public void Insert(int index, retencion obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(retencion obj)
		{
			base.Remove(obj);
		}

		new public retencion this[int index]
		{
			get { return (retencion) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class detalleCollection : ArrayList
	{
		public detalle Add(detalle obj)
		{
			base.Add(obj);
			return obj;
		}

		public detalle Add()
		{
			return Add(new detalle());
		}

		public void Insert(int index, detalle obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(detalle obj)
		{
			base.Remove(obj);
		}

		new public detalle this[int index]
		{
			get { return (detalle) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class reembolsoDetalleCollection : ArrayList
	{
		public reembolsoDetalle Add(reembolsoDetalle obj)
		{
			base.Add(obj);
			return obj;
		}

		public reembolsoDetalle Add()
		{
			return Add(new reembolsoDetalle());
		}

		public void Insert(int index, reembolsoDetalle obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(reembolsoDetalle obj)
		{
			base.Remove(obj);
		}

		new public reembolsoDetalle this[int index]
		{
			get { return (reembolsoDetalle) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class rubroCollection : ArrayList
	{
		public rubro Add(rubro obj)
		{
			base.Add(obj);
			return obj;
		}

		public rubro Add()
		{
			return Add(new rubro());
		}

		public void Insert(int index, rubro obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(rubro obj)
		{
			base.Remove(obj);
		}

		new public rubro this[int index]
		{
			get { return (rubro) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class impuestoCollection : ArrayList
	{
		public impuesto Add(impuesto obj)
		{
			base.Add(obj);
			return obj;
		}

		public impuesto Add()
		{
			return Add(new impuesto());
		}

		public void Insert(int index, impuesto obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(impuesto obj)
		{
			base.Remove(obj);
		}

		new public impuesto this[int index]
		{
			get { return (impuesto) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class campoAdicionalCollection : ArrayList
	{
		public campoAdicional Add(campoAdicional obj)
		{
			base.Add(obj);
			return obj;
		}

		public campoAdicional Add()
		{
			return Add(new campoAdicional());
		}

		public void Insert(int index, campoAdicional obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(campoAdicional obj)
		{
			base.Remove(obj);
		}

		new public campoAdicional this[int index]
		{
			get { return (campoAdicional) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class detalleImpuestoCollection : ArrayList
	{
		public detalleImpuesto Add(detalleImpuesto obj)
		{
			base.Add(obj);
			return obj;
		}

		public detalleImpuesto Add()
		{
			return Add(new detalleImpuesto());
		}

		public void Insert(int index, detalleImpuesto obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(detalleImpuesto obj)
		{
			base.Remove(obj);
		}

		new public detalleImpuesto this[int index]
		{
			get { return (detalleImpuesto) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class pagoCollection : ArrayList
	{
		public pago Add(pago obj)
		{
			base.Add(obj);
			return obj;
		}

		public pago Add()
		{
			return Add(new pago());
		}

		public void Insert(int index, pago obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(pago obj)
		{
			base.Remove(obj);
		}

		new public pago this[int index]
		{
			get { return (pago) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class destinoCollection : ArrayList
	{
		public destino Add(destino obj)
		{
			base.Add(obj);
			return obj;
		}

		public destino Add()
		{
			return Add(new destino());
		}

		public void Insert(int index, destino obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(destino obj)
		{
			base.Remove(obj);
		}

		new public destino this[int index]
		{
			get { return (destino) base[index]; }
			set { base[index] = value; }
		}
	}

	[Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class compensacionCollection : ArrayList
	{
		public compensacion Add(compensacion obj)
		{
			base.Add(obj);
			return obj;
		}

		public compensacion Add()
		{
			return Add(new compensacion());
		}

		public void Insert(int index, compensacion obj)
		{
			base.Insert(index, obj);
		}

		public void Remove(compensacion obj)
		{
			base.Remove(obj);
		}

		new public compensacion this[int index]
		{
			get { return (compensacion) base[index]; }
			set { base[index] = value; }
		}
	}



	[XmlType(TypeName="detalleImpuestos"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class detalleImpuestos
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return detalleImpuestoCollection.GetEnumerator();
		}

		public detalleImpuesto Add(detalleImpuesto obj)
		{
			return detalleImpuestoCollection.Add(obj);
		}

		[XmlIgnore]
		public detalleImpuesto this[int index]
		{
			get { return (detalleImpuesto) detalleImpuestoCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return detalleImpuestoCollection.Count; }
        }

        public void Clear()
		{
			detalleImpuestoCollection.Clear();
        }

		public detalleImpuesto Remove(int index) 
		{ 
            detalleImpuesto obj = detalleImpuestoCollection[index];
            detalleImpuestoCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            detalleImpuestoCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(detalleImpuesto),ElementName="detalleImpuesto",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public detalleImpuestoCollection __detalleImpuestoCollection;
		
		[XmlIgnore]
		public detalleImpuestoCollection detalleImpuestoCollection
		{
			get
			{
				if (__detalleImpuestoCollection == null) __detalleImpuestoCollection = new detalleImpuestoCollection();
				return __detalleImpuestoCollection;
			}
			set {__detalleImpuestoCollection = value;}
		}

		public detalleImpuestos()
		{
		}
	}


	[XmlType(TypeName="detalleImpuesto"),Serializable]
	public class detalleImpuesto
	{

		[XmlElement(ElementName="codigo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigo;
		
		[XmlIgnore]
		public string codigo
		{ 
			get { return __codigo; }
			set { __codigo = value; }
		}

		[XmlElement(ElementName="codigoPorcentaje",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigoPorcentaje;
		
		[XmlIgnore]
		public string codigoPorcentaje
		{ 
			get { return __codigoPorcentaje; }
			set { __codigoPorcentaje = value; }
		}

		[XmlElement(ElementName="tarifa",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __tarifa;
		
		[XmlIgnore]
		public string tarifa
		{ 
			get { return __tarifa; }
			set { __tarifa = value; }
		}

		[XmlElement(ElementName="baseImponibleReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __baseImponibleReembolso;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __baseImponibleReembolsoSpecified;
		
		[XmlIgnore]
		public decimal baseImponibleReembolso
		{ 
			get { return __baseImponibleReembolso; }
			set { __baseImponibleReembolso = value; __baseImponibleReembolsoSpecified = true; }
		}

		[XmlElement(ElementName="impuestoReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __impuestoReembolso;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __impuestoReembolsoSpecified;
		
		[XmlIgnore]
		public decimal impuestoReembolso
		{ 
			get { return __impuestoReembolso; }
			set { __impuestoReembolso = value; __impuestoReembolsoSpecified = true; }
		}

		public detalleImpuesto()
		{
		}
	}


	[XmlType(TypeName="impuesto"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class impuesto
	{

		[XmlElement(ElementName="codigo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigo;
		
		[XmlIgnore]
		public string codigo
		{ 
			get { return __codigo; }
			set { __codigo = value; }
		}

		[XmlElement(ElementName="codigoPorcentaje",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigoPorcentaje;
		
		[XmlIgnore]
		public string codigoPorcentaje
		{ 
			get { return __codigoPorcentaje; }
			set { __codigoPorcentaje = value; }
		}

		[XmlElement(ElementName="tarifa",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __tarifa;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __tarifaSpecified;
		
		[XmlIgnore]
		public decimal tarifa
		{ 
			get { return __tarifa; }
			set { __tarifa = value; __tarifaSpecified = true; }
		}

		[XmlElement(ElementName="baseImponible",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __baseImponible;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __baseImponibleSpecified;
		
		[XmlIgnore]
		public decimal baseImponible
		{ 
			get { return __baseImponible; }
			set { __baseImponible = value; __baseImponibleSpecified = true; }
		}

		[XmlElement(ElementName="valor",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valor;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorSpecified;
		
		[XmlIgnore]
		public decimal valor
		{ 
			get { return __valor; }
			set { __valor = value; __valorSpecified = true; }
		}

		public impuesto()
		{
		}
	}


	[XmlType(TypeName="destino"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class destino
	{

		[XmlElement(ElementName="motivoTraslado",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __motivoTraslado;
		
		[XmlIgnore]
		public string motivoTraslado
		{ 
			get { return __motivoTraslado; }
			set { __motivoTraslado = value; }
		}

		[XmlElement(ElementName="docAduaneroUnico",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __docAduaneroUnico;
		
		[XmlIgnore]
		public string docAduaneroUnico
		{ 
			get { return __docAduaneroUnico; }
			set { __docAduaneroUnico = value; }
		}

		[XmlElement(ElementName="codEstabDestino",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codEstabDestino;
		
		[XmlIgnore]
		public string codEstabDestino
		{ 
			get { return __codEstabDestino; }
			set { __codEstabDestino = value; }
		}

		[XmlElement(ElementName="ruta",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __ruta;
		
		[XmlIgnore]
		public string ruta
		{ 
			get { return __ruta; }
			set { __ruta = value; }
		}

		public destino()
		{
		}
	}


	[XmlType(TypeName="rubro"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class rubro
	{

		[XmlElement(ElementName="concepto",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __concepto;
		
		[XmlIgnore]
		public string concepto
		{ 
			get { return __concepto; }
			set { __concepto = value; }
		}

		[XmlElement(ElementName="total",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __total;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalSpecified;
		
		[XmlIgnore]
		public decimal total
		{ 
			get { return __total; }
			set { __total = value; __totalSpecified = true; }
		}

		public rubro()
		{
		}
	}


	[XmlType(TypeName="pagos"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class pagos
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return pagoCollection.GetEnumerator();
		}

		public pago Add(pago obj)
		{
			return pagoCollection.Add(obj);
		}

		[XmlIgnore]
		public pago this[int index]
		{
			get { return (pago) pagoCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return pagoCollection.Count; }
        }

        public void Clear()
		{
			pagoCollection.Clear();
        }

		public pago Remove(int index) 
		{ 
            pago obj = pagoCollection[index];
            pagoCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            pagoCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(pago),ElementName="pago",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public pagoCollection __pagoCollection;
		
		[XmlIgnore]
		public pagoCollection pagoCollection
		{
			get
			{
				if (__pagoCollection == null) __pagoCollection = new pagoCollection();
				return __pagoCollection;
			}
			set {__pagoCollection = value;}
		}

		public pagos()
		{
		}
	}


	[XmlType(TypeName="pago"),Serializable]
	public class pago
	{

		[XmlElement(ElementName="formaPago",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __formaPago;
		
		[XmlIgnore]
		public string formaPago
		{ 
			get { return __formaPago; }
			set { __formaPago = value; }
		}

		[XmlElement(ElementName="total",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __total;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalSpecified;
		
		[XmlIgnore]
		public decimal total
		{ 
			get { return __total; }
			set { __total = value; __totalSpecified = true; }
		}

		[XmlElement(ElementName="plazo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __plazo;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __plazoSpecified;
		
		[XmlIgnore]
		public decimal plazo
		{ 
			get { return __plazo; }
			set { __plazo = value; __plazoSpecified = true; }
		}

		[XmlElement(ElementName="unidadTiempo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __unidadTiempo;
		
		[XmlIgnore]
		public string unidadTiempo
		{ 
			get { return __unidadTiempo; }
			set { __unidadTiempo = value; }
		}

		public pago()
		{
		}
	}


	[XmlType(TypeName="compensacionesReembolso"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class compensacionesReembolso
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return compensacionReembolsoCollection.GetEnumerator();
		}

		public compensacion Add(compensacion obj)
		{
			return compensacionReembolsoCollection.Add(obj);
		}

		[XmlIgnore]
		public compensacion this[int index]
		{
			get { return (compensacion) compensacionReembolsoCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return compensacionReembolsoCollection.Count; }
        }

        public void Clear()
		{
			compensacionReembolsoCollection.Clear();
        }

		public compensacion Remove(int index) 
		{ 
            compensacion obj = compensacionReembolsoCollection[index];
            compensacionReembolsoCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            compensacionReembolsoCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(compensacion),ElementName="compensacionReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public compensacionCollection __compensacionReembolsoCollection;
		
		[XmlIgnore]
		public compensacionCollection compensacionReembolsoCollection
		{
			get
			{
				if (__compensacionReembolsoCollection == null) __compensacionReembolsoCollection = new compensacionCollection();
				return __compensacionReembolsoCollection;
			}
			set {__compensacionReembolsoCollection = value;}
		}

		public compensacionesReembolso()
		{
		}
	}


	[XmlType(TypeName="infoTributaria"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class infoTributaria
	{

		[XmlElement(ElementName="ambiente",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __ambiente;
		
		[XmlIgnore]
		public string ambiente
		{ 
			get { return __ambiente; }
			set { __ambiente = value; }
		}

		[XmlElement(ElementName="tipoEmision",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __tipoEmision;
		
		[XmlIgnore]
		public string tipoEmision
		{ 
			get { return __tipoEmision; }
			set { __tipoEmision = value; }
		}

		[XmlElement(ElementName="razonSocial",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __razonSocial;
		
		[XmlIgnore]
		public string razonSocial
		{ 
			get { return __razonSocial; }
			set { __razonSocial = value; }
		}

		[XmlElement(ElementName="nombreComercial",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __nombreComercial;
		
		[XmlIgnore]
		public string nombreComercial
		{ 
			get { return __nombreComercial; }
			set { __nombreComercial = value; }
		}

		[XmlElement(ElementName="ruc",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __ruc;
		
		[XmlIgnore]
		public string ruc
		{ 
			get { return __ruc; }
			set { __ruc = value; }
		}

		[XmlElement(ElementName="claveAcceso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __claveAcceso;
		
		[XmlIgnore]
		public string claveAcceso
		{ 
			get { return __claveAcceso; }
			set { __claveAcceso = value; }
		}

		[XmlElement(ElementName="codDoc",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codDoc;
		
		[XmlIgnore]
		public string codDoc
		{ 
			get { return __codDoc; }
			set { __codDoc = value; }
		}

		[XmlElement(ElementName="estab",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __estab;
		
		[XmlIgnore]
		public string estab
		{ 
			get { return __estab; }
			set { __estab = value; }
		}

		[XmlElement(ElementName="ptoEmi",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __ptoEmi;
		
		[XmlIgnore]
		public string ptoEmi
		{ 
			get { return __ptoEmi; }
			set { __ptoEmi = value; }
		}

		[XmlElement(ElementName="secuencial",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __secuencial;
		
		[XmlIgnore]
		public string secuencial
		{ 
			get { return __secuencial; }
			set { __secuencial = value; }
		}

		[XmlElement(ElementName="dirMatriz",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __dirMatriz;
		
		[XmlIgnore]
		public string dirMatriz
		{ 
			get { return __dirMatriz; }
			set { __dirMatriz = value; }
		}

		public infoTributaria()
		{
		}
	}


	[XmlType(TypeName="compensacion"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class compensacion
	{

		[XmlElement(ElementName="codigo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigo;
		
		[XmlIgnore]
		public string codigo
		{ 
			get { return __codigo; }
			set { __codigo = value; }
		}

		[XmlElement(ElementName="tarifa",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __tarifa;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __tarifaSpecified;
		
		[XmlIgnore]
		public decimal tarifa
		{ 
			get { return __tarifa; }
			set { __tarifa = value; __tarifaSpecified = true; }
		}

		[XmlElement(ElementName="valor",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valor;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorSpecified;
		
		[XmlIgnore]
		public decimal valor
		{ 
			get { return __valor; }
			set { __valor = value; __valorSpecified = true; }
		}

		public compensacion()
		{
		}
	}


	[XmlType(TypeName="compensaciones"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class compensaciones
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return compensacionCollection.GetEnumerator();
		}

		public compensacion Add(compensacion obj)
		{
			return compensacionCollection.Add(obj);
		}

		[XmlIgnore]
		public compensacion this[int index]
		{
			get { return (compensacion) compensacionCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return compensacionCollection.Count; }
        }

        public void Clear()
		{
			compensacionCollection.Clear();
        }

		public compensacion Remove(int index) 
		{ 
            compensacion obj = compensacionCollection[index];
            compensacionCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            compensacionCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(compensacion),ElementName="compensacion",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public compensacionCollection __compensacionCollection;
		
		[XmlIgnore]
		public compensacionCollection compensacionCollection
		{
			get
			{
				if (__compensacionCollection == null) __compensacionCollection = new compensacionCollection();
				return __compensacionCollection;
			}
			set {__compensacionCollection = value;}
		}

		public compensaciones()
		{
		}
	}


	[XmlType(TypeName="reembolsos"),Serializable]
	[EditorBrowsable(EditorBrowsableState.Advanced)]
	public class reembolsos
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return reembolsoDetalleCollection.GetEnumerator();
		}

		public reembolsoDetalle Add(reembolsoDetalle obj)
		{
			return reembolsoDetalleCollection.Add(obj);
		}

		[XmlIgnore]
		public reembolsoDetalle this[int index]
		{
			get { return (reembolsoDetalle) reembolsoDetalleCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return reembolsoDetalleCollection.Count; }
        }

        public void Clear()
		{
			reembolsoDetalleCollection.Clear();
        }

		public reembolsoDetalle Remove(int index) 
		{ 
            reembolsoDetalle obj = reembolsoDetalleCollection[index];
            reembolsoDetalleCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            reembolsoDetalleCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(reembolsoDetalle),ElementName="reembolsoDetalle",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public reembolsoDetalleCollection __reembolsoDetalleCollection;
		
		[XmlIgnore]
		public reembolsoDetalleCollection reembolsoDetalleCollection
		{
			get
			{
				if (__reembolsoDetalleCollection == null) __reembolsoDetalleCollection = new reembolsoDetalleCollection();
				return __reembolsoDetalleCollection;
			}
			set {__reembolsoDetalleCollection = value;}
		}

		public reembolsos()
		{
		}
	}


	[XmlType(TypeName="reembolsoDetalle"),Serializable]
	public class reembolsoDetalle
	{

		[XmlElement(ElementName="tipoIdentificacionProveedorReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __tipoIdentificacionProveedorReembolso;
		
		[XmlIgnore]
		public string tipoIdentificacionProveedorReembolso
		{ 
			get { return __tipoIdentificacionProveedorReembolso; }
			set { __tipoIdentificacionProveedorReembolso = value; }
		}

		[XmlElement(ElementName="identificacionProveedorReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __identificacionProveedorReembolso;
		
		[XmlIgnore]
		public string identificacionProveedorReembolso
		{ 
			get { return __identificacionProveedorReembolso; }
			set { __identificacionProveedorReembolso = value; }
		}

		[XmlElement(ElementName="codPaisPagoProveedorReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codPaisPagoProveedorReembolso;
		
		[XmlIgnore]
		public string codPaisPagoProveedorReembolso
		{ 
			get { return __codPaisPagoProveedorReembolso; }
			set { __codPaisPagoProveedorReembolso = value; }
		}

		[XmlElement(ElementName="tipoProveedorReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __tipoProveedorReembolso;
		
		[XmlIgnore]
		public string tipoProveedorReembolso
		{ 
			get { return __tipoProveedorReembolso; }
			set { __tipoProveedorReembolso = value; }
		}

		[XmlElement(ElementName="codDocReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codDocReembolso;
		
		[XmlIgnore]
		public string codDocReembolso
		{ 
			get { return __codDocReembolso; }
			set { __codDocReembolso = value; }
		}

		[XmlElement(ElementName="estabDocReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __estabDocReembolso;
		
		[XmlIgnore]
		public string estabDocReembolso
		{ 
			get { return __estabDocReembolso; }
			set { __estabDocReembolso = value; }
		}

		[XmlElement(ElementName="ptoEmiDocReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __ptoEmiDocReembolso;
		
		[XmlIgnore]
		public string ptoEmiDocReembolso
		{ 
			get { return __ptoEmiDocReembolso; }
			set { __ptoEmiDocReembolso = value; }
		}

		[XmlElement(ElementName="secuencialDocReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __secuencialDocReembolso;
		
		[XmlIgnore]
		public string secuencialDocReembolso
		{ 
			get { return __secuencialDocReembolso; }
			set { __secuencialDocReembolso = value; }
		}

		[XmlElement(ElementName="fechaEmisionDocReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __fechaEmisionDocReembolso;
		
		[XmlIgnore]
		public string fechaEmisionDocReembolso
		{ 
			get { return __fechaEmisionDocReembolso; }
			set { __fechaEmisionDocReembolso = value; }
		}

		[XmlElement(ElementName="numeroautorizacionDocReemb",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __numeroautorizacionDocReemb;
		
		[XmlIgnore]
		public string numeroautorizacionDocReemb
		{ 
			get { return __numeroautorizacionDocReemb; }
			set { __numeroautorizacionDocReemb = value; }
		}

		[XmlElement(Type=typeof(detalleImpuestos),ElementName="detalleImpuestos",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public detalleImpuestos __detalleImpuestos;
		
		[XmlIgnore]
		public detalleImpuestos detalleImpuestos
		{
			get
			{
				if (__detalleImpuestos == null) __detalleImpuestos = new detalleImpuestos();		
				return __detalleImpuestos;
			}
			set {__detalleImpuestos = value;}
		}

		[XmlElement(Type=typeof(compensacionesReembolso),ElementName="compensacionesReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public compensacionesReembolso __compensacionesReembolso;
		
		[XmlIgnore]
		public compensacionesReembolso compensacionesReembolso
		{
			get
			{
				if (__compensacionesReembolso == null) __compensacionesReembolso = new compensacionesReembolso();		
				return __compensacionesReembolso;
			}
			set {__compensacionesReembolso = value;}
		}

		public reembolsoDetalle()
		{
		}
	}


	[XmlRoot(ElementName="factura",IsNullable=false),Serializable]
	public class factura: BusinessEntity
	{

		[XmlAttribute(AttributeName="id")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public id __id;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __idSpecified;
		
		[XmlIgnore]
		public id id
		{ 
			get { return __id; }
			set { __id = value; __idSpecified = true; }
		}

		[XmlAttribute(AttributeName="version")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __version;
		
		[XmlIgnore]
		public string version
		{ 
			get { return __version; }
			set { __version = value; }
		}

		[XmlElement(Type=typeof(infoTributaria),ElementName="infoTributaria",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public infoTributaria __infoTributaria;
		
		[XmlIgnore]
		public infoTributaria infoTributaria
		{
			get
			{
				if (__infoTributaria == null) __infoTributaria = new infoTributaria();		
				return __infoTributaria;
			}
			set {__infoTributaria = value;}
		}

		[XmlElement(Type=typeof(infoFactura),ElementName="infoFactura",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public infoFactura __infoFactura;
		
		[XmlIgnore]
		public infoFactura infoFactura
		{
			get
			{
				if (__infoFactura == null) __infoFactura = new infoFactura();		
				return __infoFactura;
			}
			set {__infoFactura = value;}
		}

		[XmlElement(Type=typeof(detalles),ElementName="detalles",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public detalles __detalles;
		
		[XmlIgnore]
		public detalles detalles
		{
			get
			{
				if (__detalles == null) __detalles = new detalles();		
				return __detalles;
			}
			set {__detalles = value;}
		}

		[XmlElement(Type=typeof(reembolsos),ElementName="reembolsos",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public reembolsos __reembolsos;
		
		[XmlIgnore]
		public reembolsos reembolsos
		{
			get
			{
				if (__reembolsos == null) __reembolsos = new reembolsos();		
				return __reembolsos;
			}
			set {__reembolsos = value;}
		}

		[XmlElement(Type=typeof(retenciones),ElementName="retenciones",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public retenciones __retenciones;
		
		[XmlIgnore]
		public retenciones retenciones
		{
			get
			{
				if (__retenciones == null) __retenciones = new retenciones();		
				return __retenciones;
			}
			set {__retenciones = value;}
		}

		[XmlElement(Type=typeof(infoSustitutivaGuiaRemision),ElementName="infoSustitutivaGuiaRemision",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public infoSustitutivaGuiaRemision __infoSustitutivaGuiaRemision;
		
		[XmlIgnore]
		public infoSustitutivaGuiaRemision infoSustitutivaGuiaRemision
		{
			get
			{
				if (__infoSustitutivaGuiaRemision == null) __infoSustitutivaGuiaRemision = new infoSustitutivaGuiaRemision();		
				return __infoSustitutivaGuiaRemision;
			}
			set {__infoSustitutivaGuiaRemision = value;}
		}

		[XmlElement(Type=typeof(otrosRubrosTerceros),ElementName="otrosRubrosTerceros",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public otrosRubrosTerceros __otrosRubrosTerceros;
		
		[XmlIgnore]
		public otrosRubrosTerceros otrosRubrosTerceros
		{
			get
			{
				if (__otrosRubrosTerceros == null) __otrosRubrosTerceros = new otrosRubrosTerceros();		
				return __otrosRubrosTerceros;
			}
			set {__otrosRubrosTerceros = value;}
		}

		[XmlElement(Type=typeof(infoAdicional),ElementName="infoAdicional",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public infoAdicional __infoAdicional;
		
		[XmlIgnore]
		public infoAdicional infoAdicional
		{
			get
			{
				if (__infoAdicional == null) __infoAdicional = new infoAdicional();		
				return __infoAdicional;
			}
			set {__infoAdicional = value;}
		}

		public factura()
		{
		}
	}


	[XmlType(TypeName="infoFactura"),Serializable]
	public class infoFactura
	{

		[XmlElement(ElementName="fechaEmision",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __fechaEmision;
		
		[XmlIgnore]
		public string fechaEmision
		{ 
			get { return __fechaEmision; }
			set { __fechaEmision = value; }
		}

		[XmlElement(ElementName="dirEstablecimiento",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __dirEstablecimiento;
		
		[XmlIgnore]
		public string dirEstablecimiento
		{ 
			get { return __dirEstablecimiento; }
			set { __dirEstablecimiento = value; }
		}

		[XmlElement(ElementName="contribuyenteEspecial",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __contribuyenteEspecial;
		
		[XmlIgnore]
		public string contribuyenteEspecial
		{ 
			get { return __contribuyenteEspecial; }
			set { __contribuyenteEspecial = value; }
		}

		[XmlElement(ElementName="obligadoContabilidad",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __obligadoContabilidad;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __obligadoContabilidadSpecified;

        [XmlIgnore]
        public string obligadoContabilidad
        {
            get { return __obligadoContabilidad; }
            set { __obligadoContabilidad = value; __obligadoContabilidadSpecified = true; }
        }

		[XmlElement(ElementName="comercioExterior",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __comercioExterior;
		
		[XmlIgnore]
		public string comercioExterior
		{ 
			get { return __comercioExterior; }
			set { __comercioExterior = value; }
		}

		[XmlElement(ElementName="incoTermFactura",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __incoTermFactura;
		
		[XmlIgnore]
		public string incoTermFactura
		{ 
			get { return __incoTermFactura; }
			set { __incoTermFactura = value; }
		}

		[XmlElement(ElementName="lugarIncoTerm",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __lugarIncoTerm;
		
		[XmlIgnore]
		public string lugarIncoTerm
		{ 
			get { return __lugarIncoTerm; }
			set { __lugarIncoTerm = value; }
		}

		[XmlElement(ElementName="paisOrigen",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __paisOrigen;
		
		[XmlIgnore]
		public string paisOrigen
		{ 
			get { return __paisOrigen; }
			set { __paisOrigen = value; }
		}

		[XmlElement(ElementName="puertoEmbarque",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __puertoEmbarque;
		
		[XmlIgnore]
		public string puertoEmbarque
		{ 
			get { return __puertoEmbarque; }
			set { __puertoEmbarque = value; }
		}

		[XmlElement(ElementName="puertoDestino",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __puertoDestino;
		
		[XmlIgnore]
		public string puertoDestino
		{ 
			get { return __puertoDestino; }
			set { __puertoDestino = value; }
		}

		[XmlElement(ElementName="paisDestino",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __paisDestino;
		
		[XmlIgnore]
		public string paisDestino
		{ 
			get { return __paisDestino; }
			set { __paisDestino = value; }
		}

		[XmlElement(ElementName="paisAdquisicion",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __paisAdquisicion;
		
		[XmlIgnore]
		public string paisAdquisicion
		{ 
			get { return __paisAdquisicion; }
			set { __paisAdquisicion = value; }
		}

		[XmlElement(ElementName="tipoIdentificacionComprador",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __tipoIdentificacionComprador;
		
		[XmlIgnore]
		public string tipoIdentificacionComprador
		{ 
			get { return __tipoIdentificacionComprador; }
			set { __tipoIdentificacionComprador = value; }
		}

		[XmlElement(ElementName="guiaRemision",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __guiaRemision;
		
		[XmlIgnore]
		public string guiaRemision
		{ 
			get { return __guiaRemision; }
			set { __guiaRemision = value; }
		}

		[XmlElement(ElementName="razonSocialComprador",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __razonSocialComprador;
		
		[XmlIgnore]
		public string razonSocialComprador
		{ 
			get { return __razonSocialComprador; }
			set { __razonSocialComprador = value; }
		}

		[XmlElement(ElementName="identificacionComprador",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __identificacionComprador;
		
		[XmlIgnore]
		public string identificacionComprador
		{ 
			get { return __identificacionComprador; }
			set { __identificacionComprador = value; }
		}

		[XmlElement(ElementName="direccionComprador",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __direccionComprador;
		
		[XmlIgnore]
		public string direccionComprador
		{ 
			get { return __direccionComprador; }
			set { __direccionComprador = value; }
		}

		[XmlElement(ElementName="totalSinImpuestos",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __totalSinImpuestos;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalSinImpuestosSpecified;
		
		[XmlIgnore]
		public decimal totalSinImpuestos
		{ 
			get { return __totalSinImpuestos; }
			set { __totalSinImpuestos = value; __totalSinImpuestosSpecified = true; }
		}

		[XmlElement(ElementName="totalSubsidio",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __totalSubsidio;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalSubsidioSpecified;
		
		[XmlIgnore]
		public decimal totalSubsidio
		{ 
			get { return __totalSubsidio; }
			set { __totalSubsidio = value; __totalSubsidioSpecified = true; }
		}

		[XmlElement(ElementName="incoTermTotalSinImpuestos",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __incoTermTotalSinImpuestos;
		
		[XmlIgnore]
		public string incoTermTotalSinImpuestos
		{ 
			get { return __incoTermTotalSinImpuestos; }
			set { __incoTermTotalSinImpuestos = value; }
		}

		[XmlElement(ElementName="totalDescuento",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __totalDescuento;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalDescuentoSpecified;
		
		[XmlIgnore]
		public decimal totalDescuento
		{ 
			get { return __totalDescuento; }
			set { __totalDescuento = value; __totalDescuentoSpecified = true; }
		}

		[XmlElement(ElementName="codDocReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codDocReembolso;
		
		[XmlIgnore]
		public string codDocReembolso
		{ 
			get { return __codDocReembolso; }
			set { __codDocReembolso = value; }
		}

		[XmlElement(ElementName="totalComprobantesReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __totalComprobantesReembolso;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalComprobantesReembolsoSpecified;
		
		[XmlIgnore]
		public decimal totalComprobantesReembolso
		{ 
			get { return __totalComprobantesReembolso; }
			set { __totalComprobantesReembolso = value; __totalComprobantesReembolsoSpecified = true; }
		}

		[XmlElement(ElementName="totalBaseImponibleReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __totalBaseImponibleReembolso;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalBaseImponibleReembolsoSpecified;
		
		[XmlIgnore]
		public decimal totalBaseImponibleReembolso
		{ 
			get { return __totalBaseImponibleReembolso; }
			set { __totalBaseImponibleReembolso = value; __totalBaseImponibleReembolsoSpecified = true; }
		}

		[XmlElement(ElementName="totalImpuestoReembolso",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __totalImpuestoReembolso;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __totalImpuestoReembolsoSpecified;
		
		[XmlIgnore]
		public decimal totalImpuestoReembolso
		{ 
			get { return __totalImpuestoReembolso; }
			set { __totalImpuestoReembolso = value; __totalImpuestoReembolsoSpecified = true; }
		}

		[XmlElement(Type=typeof(totalConImpuestos),ElementName="totalConImpuestos",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public totalConImpuestos __totalConImpuestos;
		
		[XmlIgnore]
		public totalConImpuestos totalConImpuestos
		{
			get
			{
				if (__totalConImpuestos == null) __totalConImpuestos = new totalConImpuestos();		
				return __totalConImpuestos;
			}
			set {__totalConImpuestos = value;}
		}

		[XmlElement(Type=typeof(compensaciones),ElementName="compensaciones",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public compensaciones __compensaciones;
		
		[XmlIgnore]
		public compensaciones compensaciones
		{
			get
			{
				if (__compensaciones == null) __compensaciones = new compensaciones();		
				return __compensaciones;
			}
			set {__compensaciones = value;}
		}

		[XmlElement(ElementName="propina",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __propina;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __propinaSpecified;
		
		[XmlIgnore]
		public decimal propina
		{ 
			get { return __propina; }
			set { __propina = value; __propinaSpecified = true; }
		}

		[XmlElement(ElementName="fleteInternacional",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __fleteInternacional;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __fleteInternacionalSpecified;
		
		[XmlIgnore]
		public decimal fleteInternacional
		{ 
			get { return __fleteInternacional; }
			set { __fleteInternacional = value; __fleteInternacionalSpecified = true; }
		}

		[XmlElement(ElementName="seguroInternacional",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __seguroInternacional;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __seguroInternacionalSpecified;
		
		[XmlIgnore]
		public decimal seguroInternacional
		{ 
			get { return __seguroInternacional; }
			set { __seguroInternacional = value; __seguroInternacionalSpecified = true; }
		}

		[XmlElement(ElementName="gastosAduaneros",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __gastosAduaneros;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __gastosAduanerosSpecified;
		
		[XmlIgnore]
		public decimal gastosAduaneros
		{ 
			get { return __gastosAduaneros; }
			set { __gastosAduaneros = value; __gastosAduanerosSpecified = true; }
		}

		[XmlElement(ElementName="gastosTransporteOtros",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __gastosTransporteOtros;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __gastosTransporteOtrosSpecified;
		
		[XmlIgnore]
		public decimal gastosTransporteOtros
		{ 
			get { return __gastosTransporteOtros; }
			set { __gastosTransporteOtros = value; __gastosTransporteOtrosSpecified = true; }
		}

		[XmlElement(ElementName="importeTotal",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __importeTotal;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __importeTotalSpecified;
		
		[XmlIgnore]
		public decimal importeTotal
		{ 
			get { return __importeTotal; }
			set { __importeTotal = value; __importeTotalSpecified = true; }
		}

		[XmlElement(ElementName="moneda",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __moneda;
		
		[XmlIgnore]
		public string moneda
		{ 
			get { return __moneda; }
			set { __moneda = value; }
		}

		[XmlElement(Type=typeof(pagos),ElementName="pagos",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public pagos __pagos;
		
		[XmlIgnore]
		public pagos pagos
		{
			get
			{
				if (__pagos == null) __pagos = new pagos();		
				return __pagos;
			}
			set {__pagos = value;}
		}

		[XmlElement(ElementName="valorRetIva",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valorRetIva;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorRetIvaSpecified;
		
		[XmlIgnore]
		public decimal valorRetIva
		{ 
			get { return __valorRetIva; }
			set { __valorRetIva = value; __valorRetIvaSpecified = true; }
		}

		[XmlElement(ElementName="valorRetRenta",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valorRetRenta;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorRetRentaSpecified;
		
		[XmlIgnore]
		public decimal valorRetRenta
		{ 
			get { return __valorRetRenta; }
			set { __valorRetRenta = value; __valorRetRentaSpecified = true; }
		}

		public infoFactura()
		{
		}
	}


	[XmlType(TypeName="totalConImpuestos"),Serializable]
	public class totalConImpuestos
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return totalImpuestoCollection.GetEnumerator();
		}

		public totalImpuesto Add(totalImpuesto obj)
		{
			return totalImpuestoCollection.Add(obj);
		}

		[XmlIgnore]
		public totalImpuesto this[int index]
		{
			get { return (totalImpuesto) totalImpuestoCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return totalImpuestoCollection.Count; }
        }

        public void Clear()
		{
			totalImpuestoCollection.Clear();
        }

		public totalImpuesto Remove(int index) 
		{ 
            totalImpuesto obj = totalImpuestoCollection[index];
            totalImpuestoCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            totalImpuestoCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(totalImpuesto),ElementName="totalImpuesto",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public totalImpuestoCollection __totalImpuestoCollection;
		
		[XmlIgnore]
		public totalImpuestoCollection totalImpuestoCollection
		{
			get
			{
				if (__totalImpuestoCollection == null) __totalImpuestoCollection = new totalImpuestoCollection();
				return __totalImpuestoCollection;
			}
			set {__totalImpuestoCollection = value;}
		}

		public totalConImpuestos()
		{
		}
	}


	[XmlType(TypeName="totalImpuesto"),Serializable]
	public class totalImpuesto
	{

		[XmlElement(ElementName="codigo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigo;
		
		[XmlIgnore]
		public string codigo
		{ 
			get { return __codigo; }
			set { __codigo = value; }
		}

		[XmlElement(ElementName="codigoPorcentaje",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigoPorcentaje;
		
		[XmlIgnore]
		public string codigoPorcentaje
		{ 
			get { return __codigoPorcentaje; }
			set { __codigoPorcentaje = value; }
		}

		[XmlElement(ElementName="descuentoAdicional",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __descuentoAdicional;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __descuentoAdicionalSpecified;
		
		[XmlIgnore]
		public decimal descuentoAdicional
		{ 
			get { return __descuentoAdicional; }
			set { __descuentoAdicional = value; __descuentoAdicionalSpecified = true; }
		}

		[XmlElement(ElementName="baseImponible",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __baseImponible;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __baseImponibleSpecified;
		
		[XmlIgnore]
		public decimal baseImponible
		{ 
			get { return __baseImponible; }
			set { __baseImponible = value; __baseImponibleSpecified = true; }
		}

		[XmlElement(ElementName="tarifa",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __tarifa;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __tarifaSpecified;
		
		[XmlIgnore]
		public decimal tarifa
		{ 
			get { return __tarifa; }
			set { __tarifa = value; __tarifaSpecified = true; }
		}

		[XmlElement(ElementName="valor",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valor;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorSpecified;
		
		[XmlIgnore]
		public decimal valor
		{ 
			get { return __valor; }
			set { __valor = value; __valorSpecified = true; }
		}

		[XmlElement(ElementName="valorDevolucionIva",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valorDevolucionIva;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorDevolucionIvaSpecified;
		
		[XmlIgnore]
		public decimal valorDevolucionIva
		{ 
			get { return __valorDevolucionIva; }
			set { __valorDevolucionIva = value; __valorDevolucionIvaSpecified = true; }
		}

		public totalImpuesto()
		{
		}
	}


	[XmlType(TypeName="detalles"),Serializable]
	public class detalles
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return detalleCollection.GetEnumerator();
		}

		public detalle Add(detalle obj)
		{
			return detalleCollection.Add(obj);
		}

		[XmlIgnore]
		public detalle this[int index]
		{
			get { return (detalle) detalleCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return detalleCollection.Count; }
        }

        public void Clear()
		{
			detalleCollection.Clear();
        }

		public detalle Remove(int index) 
		{ 
            detalle obj = detalleCollection[index];
            detalleCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            detalleCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(detalle),ElementName="detalle",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public detalleCollection __detalleCollection;
		
		[XmlIgnore]
		public detalleCollection detalleCollection
		{
			get
			{
				if (__detalleCollection == null) __detalleCollection = new detalleCollection();
				return __detalleCollection;
			}
			set {__detalleCollection = value;}
		}

		public detalles()
		{
		}
	}


	[XmlType(TypeName="detalle"),Serializable]
	public class detalle
	{

		[XmlElement(ElementName="codigoPrincipal",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigoPrincipal;
		
		[XmlIgnore]
		public string codigoPrincipal
		{ 
			get { return __codigoPrincipal; }
			set { __codigoPrincipal = value; }
		}

		[XmlElement(ElementName="codigoAuxiliar",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigoAuxiliar;
		
		[XmlIgnore]
		public string codigoAuxiliar
		{ 
			get { return __codigoAuxiliar; }
			set { __codigoAuxiliar = value; }
		}

		[XmlElement(ElementName="descripcion",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __descripcion;
		
		[XmlIgnore]
		public string descripcion
		{ 
			get { return __descripcion; }
			set { __descripcion = value; }
		}

		[XmlElement(ElementName="unidadMedida",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __unidadMedida;
		
		[XmlIgnore]
		public string unidadMedida
		{ 
			get { return __unidadMedida; }
			set { __unidadMedida = value; }
		}

		[XmlElement(ElementName="cantidad",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __cantidad;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __cantidadSpecified;
		
		[XmlIgnore]
		public decimal cantidad
		{ 
			get { return __cantidad; }
			set { __cantidad = value; __cantidadSpecified = true; }
		}

		[XmlElement(ElementName="precioUnitario",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __precioUnitario;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __precioUnitarioSpecified;
		
		[XmlIgnore]
		public decimal precioUnitario
		{ 
			get { return __precioUnitario; }
			set { __precioUnitario = value; __precioUnitarioSpecified = true; }
		}

		[XmlElement(ElementName="precioSinSubsidio",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __precioSinSubsidio;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __precioSinSubsidioSpecified;
		
		[XmlIgnore]
		public decimal precioSinSubsidio
		{ 
			get { return __precioSinSubsidio; }
			set { __precioSinSubsidio = value; __precioSinSubsidioSpecified = true; }
		}

		[XmlElement(ElementName="descuento",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __descuento;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __descuentoSpecified;
		
		[XmlIgnore]
		public decimal descuento
		{ 
			get { return __descuento; }
			set { __descuento = value; __descuentoSpecified = true; }
		}

		[XmlElement(ElementName="precioTotalSinImpuesto",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __precioTotalSinImpuesto;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __precioTotalSinImpuestoSpecified;
		
		[XmlIgnore]
		public decimal precioTotalSinImpuesto
		{ 
			get { return __precioTotalSinImpuesto; }
			set { __precioTotalSinImpuesto = value; __precioTotalSinImpuestoSpecified = true; }
		}

		[XmlElement(Type=typeof(detallesAdicionales),ElementName="detallesAdicionales",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public detallesAdicionales __detallesAdicionales;
		
		[XmlIgnore]
		public detallesAdicionales detallesAdicionales
		{
			get
			{
				if (__detallesAdicionales == null) __detallesAdicionales = new detallesAdicionales();		
				return __detallesAdicionales;
			}
			set {__detallesAdicionales = value;}
		}

		[XmlElement(Type=typeof(impuestos),ElementName="impuestos",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public impuestos __impuestos;
		
		[XmlIgnore]
		public impuestos impuestos
		{
			get
			{
				if (__impuestos == null) __impuestos = new impuestos();		
				return __impuestos;
			}
			set {__impuestos = value;}
		}

		public detalle()
		{
		}
	}


	[XmlType(TypeName="detallesAdicionales"),Serializable]
	public class detallesAdicionales
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return detAdicionalCollection.GetEnumerator();
		}

		public detAdicional Add(detAdicional obj)
		{
			return detAdicionalCollection.Add(obj);
		}

		[XmlIgnore]
		public detAdicional this[int index]
		{
			get { return (detAdicional) detAdicionalCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return detAdicionalCollection.Count; }
        }

        public void Clear()
		{
			detAdicionalCollection.Clear();
        }

		public detAdicional Remove(int index) 
		{ 
            detAdicional obj = detAdicionalCollection[index];
            detAdicionalCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            detAdicionalCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(detAdicional),ElementName="detAdicional",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public detAdicionalCollection __detAdicionalCollection;
		
		[XmlIgnore]
		public detAdicionalCollection detAdicionalCollection
		{
			get
			{
				if (__detAdicionalCollection == null) __detAdicionalCollection = new detAdicionalCollection();
				return __detAdicionalCollection;
			}
			set {__detAdicionalCollection = value;}
		}

		public detallesAdicionales()
		{
		}
	}


	[XmlType(TypeName="detAdicional"),Serializable]
	public class detAdicional
	{

		[XmlAttribute(AttributeName="nombre",DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __nombre;
		
		[XmlIgnore]
		public string nombre
		{ 
			get { return __nombre; }
			set { __nombre = value; }
		}

		[XmlAttribute(AttributeName="valor",DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __valor;
		
		[XmlIgnore]
		public string valor
		{ 
			get { return __valor; }
			set { __valor = value; }
		}

		public detAdicional()
		{
		}
	}


	[XmlType(TypeName="impuestos"),Serializable]
	public class impuestos
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return impuestoCollection.GetEnumerator();
		}

		public impuesto Add(impuesto obj)
		{
			return impuestoCollection.Add(obj);
		}

		[XmlIgnore]
		public impuesto this[int index]
		{
			get { return (impuesto) impuestoCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return impuestoCollection.Count; }
        }

        public void Clear()
		{
			impuestoCollection.Clear();
        }

		public impuesto Remove(int index) 
		{ 
            impuesto obj = impuestoCollection[index];
            impuestoCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            impuestoCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(impuesto),ElementName="impuesto",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public impuestoCollection __impuestoCollection;
		
		[XmlIgnore]
		public impuestoCollection impuestoCollection
		{
			get
			{
				if (__impuestoCollection == null) __impuestoCollection = new impuestoCollection();
				return __impuestoCollection;
			}
			set {__impuestoCollection = value;}
		}

		public impuestos()
		{
		}
	}


	[XmlType(TypeName="retenciones"),Serializable]
	public class retenciones
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return retencionCollection.GetEnumerator();
		}

		public retencion Add(retencion obj)
		{
			return retencionCollection.Add(obj);
		}

		[XmlIgnore]
		public retencion this[int index]
		{
			get { return (retencion) retencionCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return retencionCollection.Count; }
        }

        public void Clear()
		{
			retencionCollection.Clear();
        }

		public retencion Remove(int index) 
		{ 
            retencion obj = retencionCollection[index];
            retencionCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            retencionCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(retencion),ElementName="retencion",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public retencionCollection __retencionCollection;
		
		[XmlIgnore]
		public retencionCollection retencionCollection
		{
			get
			{
				if (__retencionCollection == null) __retencionCollection = new retencionCollection();
				return __retencionCollection;
			}
			set {__retencionCollection = value;}
		}

		public retenciones()
		{
		}
	}


	[XmlType(TypeName="retencion"),Serializable]
	public class retencion
	{

		[XmlElement(ElementName="codigo",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigo;
		
		[XmlIgnore]
		public string codigo
		{ 
			get { return __codigo; }
			set { __codigo = value; }
		}

		[XmlElement(ElementName="codigoPorcentaje",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __codigoPorcentaje;
		
		[XmlIgnore]
		public string codigoPorcentaje
		{ 
			get { return __codigoPorcentaje; }
			set { __codigoPorcentaje = value; }
		}

		[XmlElement(ElementName="tarifa",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __tarifa;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __tarifaSpecified;
		
		[XmlIgnore]
		public decimal tarifa
		{ 
			get { return __tarifa; }
			set { __tarifa = value; __tarifaSpecified = true; }
		}

		[XmlElement(ElementName="valor",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="decimal")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public decimal __valor;
		
		[XmlIgnore]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public bool __valorSpecified;
		
		[XmlIgnore]
		public decimal valor
		{ 
			get { return __valor; }
			set { __valor = value; __valorSpecified = true; }
		}

		public retencion()
		{
		}
	}


	[XmlType(TypeName="infoSustitutivaGuiaRemision"),Serializable]
	public class infoSustitutivaGuiaRemision
	{

		[XmlElement(ElementName="dirPartida",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __dirPartida;
		
		[XmlIgnore]
		public string dirPartida
		{ 
			get { return __dirPartida; }
			set { __dirPartida = value; }
		}

		[XmlElement(ElementName="dirDestinatario",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __dirDestinatario;
		
		[XmlIgnore]
		public string dirDestinatario
		{ 
			get { return __dirDestinatario; }
			set { __dirDestinatario = value; }
		}

		[XmlElement(ElementName="fechaIniTransporte",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __fechaIniTransporte;
		
		[XmlIgnore]
		public string fechaIniTransporte
		{ 
			get { return __fechaIniTransporte; }
			set { __fechaIniTransporte = value; }
		}

		[XmlElement(ElementName="fechaFinTransporte",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __fechaFinTransporte;
		
		[XmlIgnore]
		public string fechaFinTransporte
		{ 
			get { return __fechaFinTransporte; }
			set { __fechaFinTransporte = value; }
		}

		[XmlElement(ElementName="razonSocialTransportista",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __razonSocialTransportista;
		
		[XmlIgnore]
		public string razonSocialTransportista
		{ 
			get { return __razonSocialTransportista; }
			set { __razonSocialTransportista = value; }
		}

		[XmlElement(ElementName="tipoIdentificacionTransportista",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __tipoIdentificacionTransportista;
		
		[XmlIgnore]
		public string tipoIdentificacionTransportista
		{ 
			get { return __tipoIdentificacionTransportista; }
			set { __tipoIdentificacionTransportista = value; }
		}

		[XmlElement(ElementName="rucTransportista",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __rucTransportista;
		
		[XmlIgnore]
		public string rucTransportista
		{ 
			get { return __rucTransportista; }
			set { __rucTransportista = value; }
		}

		[XmlElement(ElementName="placa",IsNullable=false,Form=XmlSchemaForm.Qualified,DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __placa;
		
		[XmlIgnore]
		public string placa
		{ 
			get { return __placa; }
			set { __placa = value; }
		}

		[XmlElement(Type=typeof(destinos),ElementName="destinos",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public destinos __destinos;
		
		[XmlIgnore]
		public destinos destinos
		{
			get
			{
				if (__destinos == null) __destinos = new destinos();		
				return __destinos;
			}
			set {__destinos = value;}
		}

		public infoSustitutivaGuiaRemision()
		{
		}
	}


	[XmlType(TypeName="destinos"),Serializable]
	public class destinos
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return destinoCollection.GetEnumerator();
		}

		public destino Add(destino obj)
		{
			return destinoCollection.Add(obj);
		}

		[XmlIgnore]
		public destino this[int index]
		{
			get { return (destino) destinoCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return destinoCollection.Count; }
        }

        public void Clear()
		{
			destinoCollection.Clear();
        }

		public destino Remove(int index) 
		{ 
            destino obj = destinoCollection[index];
            destinoCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            destinoCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(destino),ElementName="destino",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public destinoCollection __destinoCollection;
		
		[XmlIgnore]
		public destinoCollection destinoCollection
		{
			get
			{
				if (__destinoCollection == null) __destinoCollection = new destinoCollection();
				return __destinoCollection;
			}
			set {__destinoCollection = value;}
		}

		public destinos()
		{
		}
	}


	[XmlType(TypeName="otrosRubrosTerceros"),Serializable]
	public class otrosRubrosTerceros
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return rubroCollection.GetEnumerator();
		}

		public rubro Add(rubro obj)
		{
			return rubroCollection.Add(obj);
		}

		[XmlIgnore]
		public rubro this[int index]
		{
			get { return (rubro) rubroCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return rubroCollection.Count; }
        }

        public void Clear()
		{
			rubroCollection.Clear();
        }

		public rubro Remove(int index) 
		{ 
            rubro obj = rubroCollection[index];
            rubroCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            rubroCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(rubro),ElementName="rubro",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public rubroCollection __rubroCollection;
		
		[XmlIgnore]
		public rubroCollection rubroCollection
		{
			get
			{
				if (__rubroCollection == null) __rubroCollection = new rubroCollection();
				return __rubroCollection;
			}
			set {__rubroCollection = value;}
		}

		public otrosRubrosTerceros()
		{
		}
	}


	[XmlType(TypeName="infoAdicional"),Serializable]
	public class infoAdicional
	{
		[System.Runtime.InteropServices.DispIdAttribute(-4)]
		public IEnumerator GetEnumerator() 
		{
            return campoAdicionalCollection.GetEnumerator();
		}

		public campoAdicional Add(campoAdicional obj)
		{
			return campoAdicionalCollection.Add(obj);
		}

		[XmlIgnore]
		public campoAdicional this[int index]
		{
			get { return (campoAdicional) campoAdicionalCollection[index]; }
		}

		[XmlIgnore]
        public int Count 
		{
            get { return campoAdicionalCollection.Count; }
        }

        public void Clear()
		{
			campoAdicionalCollection.Clear();
        }

		public campoAdicional Remove(int index) 
		{ 
            campoAdicional obj = campoAdicionalCollection[index];
            campoAdicionalCollection.Remove(obj);
			return obj;
        }

        public void Remove(object obj)
		{
            campoAdicionalCollection.Remove(obj);
        }

		[XmlElement(Type=typeof(campoAdicional),ElementName="campoAdicional",IsNullable=false,Form=XmlSchemaForm.Qualified)]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public campoAdicionalCollection __campoAdicionalCollection;
		
		[XmlIgnore]
		public campoAdicionalCollection campoAdicionalCollection
		{
			get
			{
				if (__campoAdicionalCollection == null) __campoAdicionalCollection = new campoAdicionalCollection();
				return __campoAdicionalCollection;
			}
			set {__campoAdicionalCollection = value;}
		}

		public infoAdicional()
		{
		}
	}


	[XmlType(TypeName="campoAdicional"),Serializable]
	public class campoAdicional
	{

		[XmlAttribute(AttributeName="nombre",DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __nombre;
		
		[XmlIgnore]
		public string nombre
		{ 
			get { return __nombre; }
			set { __nombre = value; }
		}

		[XmlText(DataType="string")]
		[EditorBrowsable(EditorBrowsableState.Advanced)]
		public string __Value;
		
		[XmlIgnore]
		public string Value
		{ 
			get { return __Value; }
			set { __Value = value; }
		}

		public campoAdicional()
		{
		}
	}
}
