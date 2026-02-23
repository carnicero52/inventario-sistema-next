'use client';

import { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, TrendingUp, AlertTriangle, 
  Plus, Search, Edit, Trash2, Download, Upload,
  Bell, Settings, BarChart3, ArrowUpRight, ArrowDownRight,
  X, Save, RefreshCw
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  precioCompra: number;
  precioVenta: number;
  gananciaPorcentaje: number;
  gananciaMonto: number;
  proveedor?: string;
  ubicacion?: string;
  activo: boolean;
}

interface Venta {
  id: string;
  numeroVenta: string;
  cliente?: string;
  subtotal: number;
  total: number;
  gananciaTotal: number;
  metodoPago: string;
  estado: string;
  createdAt: string;
  detalles: DetalleVenta[];
}

interface DetalleVenta {
  id: string;
  productoId: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Compra {
  id: string;
  numeroCompra: string;
  proveedor?: string;
  subtotal: number;
  total: number;
  estado: string;
  createdAt: string;
}

interface Movimiento {
  id: string;
  tipo: string;
  producto: Producto;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo?: string;
  createdAt: string;
}

interface Alerta {
  id: string;
  tipo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

interface Configuracion {
  nombreNegocio: string;
  emailPropietario: string;
  telegramChatId: string;
  stockMinimoGlobal: number;
  porcentajeGanancia: number;
  moneda: string;
  notificacionesEmail: boolean;
  notificacionesTelegram: boolean;
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────

export default function SistemaInventario() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState<any>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    cargarDashboard();
    cargarProductos();
    cargarConfig();
  }, []);

  const cargarDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setDashboard(data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarVentas = async () => {
    try {
      const res = await fetch('/api/ventas');
      const data = await res.json();
      setVentas(data);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    }
  };

  const cargarCompras = async () => {
    try {
      const res = await fetch('/api/compras');
      const data = await res.json();
      setCompras(data);
    } catch (error) {
      console.error('Error cargando compras:', error);
    }
  };

  const cargarMovimientos = async () => {
    try {
      const res = await fetch('/api/movimientos');
      const data = await res.json();
      setMovimientos(data);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
    }
  };

  const cargarAlertas = async () => {
    try {
      const res = await fetch('/api/alertas');
      const data = await res.json();
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  const cargarConfig = async () => {
    try {
      const res = await fetch('/api/configuracion');
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const formatCurrency = (value: number) => `${config?.moneda || '$'}${value.toFixed(2)}`;
  
  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const showToast = (message: string, type: string = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{config?.nombreNegocio || 'Sistema de Inventario'}</h1>
                <p className="text-emerald-100 text-sm">Control total de tu negocio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowModal('nueva-venta')} className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Nueva Venta
              </button>
              <button onClick={() => setShowModal('nueva-compra')} className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4" /> Nueva Compra
              </button>
              <button onClick={() => { cargarDashboard(); cargarProductos(); }} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'productos', label: 'Productos', icon: Package },
              { id: 'ventas', label: 'Ventas', icon: TrendingUp },
              { id: 'compras', label: 'Compras', icon: ShoppingCart },
              { id: 'movimientos', label: 'Movimientos', icon: ArrowUpRight },
              { id: 'alertas', label: 'Alertas', icon: AlertTriangle, badge: dashboard?.alertas?.length },
              { id: 'configuracion', label: 'Configuración', icon: Settings },
            ].map(tab => (
              <button key={tab.id} onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'ventas') cargarVentas();
                if (tab.id === 'compras') cargarCompras();
                if (tab.id === 'movimientos') cargarMovimientos();
                if (tab.id === 'alertas') cargarAlertas();
              }} className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && !dashboard ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && dashboard && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-slate-500">Productos</p>
                    <p className="text-2xl font-bold">{dashboard.totalProductos}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-slate-500">Valor Inventario</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboard.valorInventario)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-slate-500">Ganancia Potencial</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(dashboard.gananciaPotencial)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-slate-500">Ventas Hoy</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(dashboard.ventas?.hoy?.total || 0)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-400">
                    <p className="text-sm text-slate-500">Stock Bajo</p>
                    <p className="text-2xl font-bold text-yellow-600">{dashboard.productosStockBajo}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-400">
                    <p className="text-sm text-slate-500">Sin Stock</p>
                    <p className="text-2xl font-bold text-red-600">{dashboard.productosSinStock}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Productos Más Vendidos</h3>
                    {dashboard.productosMasVendidos?.length > 0 ? (
                      <div className="space-y-2">
                        {dashboard.productosMasVendidos.map((p: any, i: number) => (
                          <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
                            <span>{p.nombre}</span>
                            <span className="font-medium">{p.cantidad} uds</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-slate-500 text-center py-4">Sin ventas este mes</p>}
                  </div>
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" /> Por Categoría</h3>
                    {Object.keys(dashboard.categorias || {}).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(dashboard.categorias).map(([cat, data]: [string, any]) => (
                          <div key={cat} className="flex justify-between p-2 bg-slate-50 rounded">
                            <span>{cat}</span>
                            <span className="font-medium">{data.cantidad} productos</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-slate-500 text-center py-4">Sin categorías</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Productos Tab */}
            {activeTab === 'productos' && (
              <div className="bg-white rounded-xl shadow">
                <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedItem(null); setShowModal('producto'); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Nuevo Producto
                    </button>
                    <button onClick={() => window.open('/api/exportar/productos', '_blank')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
                      <Download className="w-4 h-4" /> Exportar
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-left text-sm text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Código</th>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Categoría</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">P. Compra</th>
                        <th className="px-4 py-3">P. Venta</th>
                        <th className="px-4 py-3">Ganancia</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosFiltrados.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-1 rounded">{p.codigo}</code></td>
                          <td className="px-4 py-3 font-medium">{p.nombre}</td>
                          <td className="px-4 py-3 text-slate-600">{p.categoria}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock <= p.stockMinimo ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              {p.stock} {p.stock <= p.stockMinimo && '⚠️'}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatCurrency(p.precioCompra)}</td>
                          <td className="px-4 py-3">{formatCurrency(p.precioVenta)}</td>
                          <td className="px-4 py-3 text-emerald-600 font-medium">{formatCurrency(p.gananciaMonto)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => { setSelectedItem(p); setShowModal('producto'); }} className="p-2 text-slate-600 hover:bg-slate-100 rounded"><Edit className="w-4 h-4" /></button>
                              <button onClick={async () => { if (confirm('¿Eliminar?')) { await fetch(`/api/productos?id=${p.id}`, { method: 'DELETE' }); cargarProductos(); showToast('Eliminado'); }}} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ventas Tab */}
            {activeTab === 'ventas' && (
              <div className="bg-white rounded-xl shadow">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-semibold">Historial de Ventas</h3>
                  <button onClick={() => setShowModal('nueva-venta')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nueva Venta
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-left text-sm text-slate-500">
                      <tr><th className="px-4 py-3">Nº Venta</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Ganancia</th><th className="px-4 py-3">Estado</th></tr>
                    </thead>
                    <tbody>
                      {ventas.map((v) => (
                        <tr key={v.id} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium">{v.numeroVenta}</td>
                          <td className="px-4 py-3 text-sm">{formatDate(v.createdAt)}</td>
                          <td className="px-4 py-3">{v.cliente || '-'}</td>
                          <td className="px-4 py-3 font-semibold">{formatCurrency(v.total)}</td>
                          <td className="px-4 py-3 text-emerald-600">{formatCurrency(v.gananciaTotal)}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${v.estado === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{v.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Compras Tab */}
            {activeTab === 'compras' && (
              <div className="bg-white rounded-xl shadow">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-semibold">Historial de Compras</h3>
                  <button onClick={() => setShowModal('nueva-compra')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nueva Compra
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-left text-sm text-slate-500">
                      <tr><th className="px-4 py-3">Nº Compra</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Proveedor</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Estado</th></tr>
                    </thead>
                    <tbody>
                      {compras.map((c) => (
                        <tr key={c.id} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium">{c.numeroCompra}</td>
                          <td className="px-4 py-3 text-sm">{formatDate(c.createdAt)}</td>
                          <td className="px-4 py-3">{c.proveedor || '-'}</td>
                          <td className="px-4 py-3 font-semibold">{formatCurrency(c.total)}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{c.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Movimientos Tab */}
            {activeTab === 'movimientos' && (
              <div className="bg-white rounded-xl shadow">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-semibold">Historial de Movimientos</h3>
                  <button onClick={() => window.open('/api/exportar/movimientos', '_blank')} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Exportar
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-left text-sm text-slate-500">
                      <tr><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Cantidad</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Motivo</th></tr>
                    </thead>
                    <tbody>
                      {movimientos.map((m) => (
                        <tr key={m.id} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm">{formatDate(m.createdAt)}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${m.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.tipo}</span></td>
                          <td className="px-4 py-3 font-medium">{m.producto?.nombre}</td>
                          <td className="px-4 py-3">{m.cantidad}</td>
                          <td className="px-4 py-3">{m.stockAnterior} → {m.stockNuevo}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{m.motivo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alertas Tab */}
            {activeTab === 'alertas' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Alertas de Stock</h3>
                  <button onClick={async () => { await fetch('/api/notificaciones'); showToast('Alertas enviadas'); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Enviar Alertas Telegram
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow divide-y">
                  {alertas.length > 0 ? alertas.map((a) => (
                    <div key={a.id} className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${a.tipo === 'SIN_STOCK' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{a.mensaje}</p>
                        <p className="text-sm text-slate-500">{formatDate(a.createdAt)}</p>
                      </div>
                    </div>
                  )) : <div className="p-8 text-center text-slate-500"><Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" /><p>No hay alertas</p></div>}
                </div>
              </div>
            )}

            {/* Configuración Tab */}
            {activeTab === 'configuracion' && config && (
              <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-semibold text-lg mb-6">Configuración</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/configuracion', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) }); showToast('Guardado'); }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Negocio</label>
                        <input type="text" value={config.nombreNegocio} onChange={(e) => setConfig({ ...config, nombreNegocio: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={config.emailPropietario} onChange={(e) => setConfig({ ...config, emailPropietario: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Chat ID Telegram</label>
                        <input type="text" value={config.telegramChatId} onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
                          <input type="number" value={config.stockMinimoGlobal} onChange={(e) => setConfig({ ...config, stockMinimoGlobal: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">% Ganancia</label>
                          <input type="number" value={config.porcentajeGanancia} onChange={(e) => setConfig({ ...config, porcentajeGanancia: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Moneda</label>
                        <input type="text" value={config.moneda} onChange={(e) => setConfig({ ...config, moneda: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={config.notificacionesTelegram} onChange={(e) => setConfig({ ...config, notificacionesTelegram: e.target.checked })} className="rounded" />
                          <span className="text-sm">Notificaciones Telegram</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={config.notificacionesEmail} onChange={(e) => setConfig({ ...config, notificacionesEmail: e.target.checked })} className="rounded" />
                          <span className="text-sm">Notificaciones Email</span>
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Producto */}
      {showModal === 'producto' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">{selectedItem ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                id: selectedItem?.id,
                codigo: (form.elements.namedItem('codigo') as HTMLInputElement).value,
                nombre: (form.elements.namedItem('nombre') as HTMLInputElement).value,
                categoria: (form.elements.namedItem('categoria') as HTMLInputElement).value || 'General',
                stock: parseFloat((form.elements.namedItem('stock') as HTMLInputElement).value) || 0,
                stockMinimo: parseFloat((form.elements.namedItem('stockMinimo') as HTMLInputElement).value) || 5,
                precioCompra: parseFloat((form.elements.namedItem('precioCompra') as HTMLInputElement).value) || 0,
                gananciaPorcentaje: parseFloat((form.elements.namedItem('ganancia') as HTMLInputElement).value) || 30,
                proveedor: (form.elements.namedItem('proveedor') as HTMLInputElement).value,
              };
              await fetch('/api/productos', { method: selectedItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
              setShowModal(null);
              cargarProductos();
              cargarDashboard();
              showToast(selectedItem ? 'Producto actualizado' : 'Producto creado');
            }} className="p-4 space-y-4">
              <input type="hidden" name="id" value={selectedItem?.id || ''} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Código</label>
                  <input name="codigo" defaultValue={selectedItem?.codigo || ''} className="w-full px-3 py-2 border rounded-lg" placeholder="Auto" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input name="nombre" defaultValue={selectedItem?.nombre || ''} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <input name="categoria" defaultValue={selectedItem?.categoria || 'General'} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Proveedor</label>
                  <input name="proveedor" defaultValue={selectedItem?.proveedor || ''} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input name="stock" type="number" defaultValue={selectedItem?.stock || 0} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
                  <input name="stockMinimo" type="number" defaultValue={selectedItem?.stockMinimo || 5} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Compra *</label>
                  <input name="precioCompra" type="number" step="0.01" defaultValue={selectedItem?.precioCompra || ''} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">% Ganancia</label>
                  <input name="ganancia" type="number" defaultValue={selectedItem?.gananciaPorcentaje || 30} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Venta</label>
                  <input type="text" readOnly value={(() => { const pc = parseFloat((form?.elements?.namedItem('precioCompra') as HTMLInputElement)?.value) || selectedItem?.precioCompra || 0; const g = parseFloat((form?.elements?.namedItem('ganancia') as HTMLInputElement)?.value) || selectedItem?.gananciaPorcentaje || 30; return formatCurrency(pc * (1 + g / 100)); })()} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Venta */}
      {showModal === 'nueva-venta' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Nueva Venta</h3>
              <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                cliente: (form.elements.namedItem('cliente') as HTMLInputElement).value,
                metodoPago: (form.elements.namedItem('metodoPago') as HTMLSelectElement).value,
                detalles: [{ productoId: (form.elements.namedItem('producto') as HTMLSelectElement).value, cantidad: parseFloat((form.elements.namedItem('cantidad') as HTMLInputElement).value), precioUnitario: parseFloat((form.elements.namedItem('precio') as HTMLInputElement).value) }]
              };
              await fetch('/api/ventas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
              setShowModal(null);
              cargarProductos();
              cargarDashboard();
              cargarVentas();
              showToast('Venta registrada');
            }} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente (opcional)</label>
                <input name="cliente" className="w-full px-3 py-2 border rounded-lg" placeholder="Nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Producto</label>
                <select name="producto" required className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Seleccionar</option>
                  {productos.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.stock} uds) - {formatCurrency(p.precioVenta)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <input name="cantidad" type="number" min="1" defaultValue="1" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input name="precio" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Método de Pago</label>
                <select name="metodoPago" className="w-full px-3 py-2 border rounded-lg">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Yape/Plin">Yape/Plin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Registrar Venta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Compra */}
      {showModal === 'nueva-compra' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Nueva Compra</h3>
              <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                proveedor: (form.elements.namedItem('proveedor') as HTMLInputElement).value,
                detalles: [{ productoId: (form.elements.namedItem('producto') as HTMLSelectElement).value, cantidad: parseFloat((form.elements.namedItem('cantidad') as HTMLInputElement).value), precioUnitario: parseFloat((form.elements.namedItem('precio') as HTMLInputElement).value) }]
              };
              await fetch('/api/compras', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
              setShowModal(null);
              cargarProductos();
              cargarDashboard();
              cargarCompras();
              showToast('Compra registrada');
            }} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Proveedor (opcional)</label>
                <input name="proveedor" className="w-full px-3 py-2 border rounded-lg" placeholder="Nombre del proveedor" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Producto</label>
                <select name="producto" required className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Seleccionar</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} - Stock: {p.stock}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <input name="cantidad" type="number" min="1" defaultValue="1" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Compra</label>
                  <input name="precio" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Registrar Compra</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
