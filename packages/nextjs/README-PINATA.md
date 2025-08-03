# 🌐 Integración Pinata IPFS para Real Estate NFTs

## 📋 Descripción

Este proyecto integra **Pinata IPFS** para almacenar de forma descentralizada los metadatos e imágenes de los NFTs de bienes raíces. Pinata proporciona una infraestructura confiable para IPFS que garantiza la disponibilidad y permanencia de los datos.

## 🔧 Configuración

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en `/packages/nextjs/` con:

```bash
NEXT_PUBLIC_PINATA_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_PINATA_SECRET_KEY=tu_secret_key_aqui
NEXT_PUBLIC_PINATA_GATEWAY=beige-electoral-sawfish-43.mypinata.cloud
```

### 2. Obtener Credenciales de Pinata

1. Ve a [https://pinata.cloud/](https://pinata.cloud/)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** en el dashboard
4. Crea una nueva API key con permisos:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `unpin` (opcional)
5. Copia el **API Key** y **Secret Key**

## 🏗️ Estructura de Metadatos

Los NFTs siguen el estándar **ERC-721** con metadatos específicos para bienes raíces:

```json
{
  "name": "Casa Familiar Moderna",
  "description": "Hermosa casa de 3 habitaciones...",
  "image": "https://beige-electoral-sawfish-43.mypinata.cloud/ipfs/QmHash123",
  "external_url": "https://maps.google.com/?q=direccion",
  "attributes": [
    {
      "trait_type": "Property Type",
      "value": "House"
    },
    {
      "trait_type": "Bedrooms",
      "value": 3
    },
    {
      "trait_type": "Valuation (USDT)",
      "value": 250000
    }
  ],
  "properties": {
    "address": "Av. Reforma 123, Ciudad de México",
    "valuation": 250000,
    "bedrooms": 3,
    "bathrooms": 2,
    "squareMeters": 180,
    "yearBuilt": 2020,
    "propertyType": "House",
    "city": "Ciudad de México",
    "country": "México",
    "coordinates": {
      "lat": 19.4326,
      "lng": -99.1332
    }
  }
}
```

## 🔄 Flujo de Creación de NFT

1. **📝 Usuario llena formulario** con datos de la propiedad
2. **📷 Usuario sube imagen** (opcional)
3. **📤 Sistema sube imagen a Pinata IPFS**
4. **📋 Sistema crea metadatos JSON** con la URL de la imagen
5. **📤 Sistema sube metadatos a Pinata IPFS**
6. **🏠 Sistema mintea NFT** con la URL de metadatos
7. **✅ NFT creado** con datos descentralizados

## 🎯 Características

### ✅ Permanencia de Datos

- Los metadatos se almacenan en IPFS de forma inmutable
- Las imágenes están disponibles globalmente
- Resistente a censura y fallas de servidor

### 📊 Metadatos Enriquecidos

- Información específica de bienes raíces
- Atributos estructurados para marketplaces
- Enlaces a mapas y recursos externos

### 🔒 Seguridad

- Hash IPFS garantiza integridad de datos
- No hay punto único de falla
- Los datos no pueden ser modificados

## 🌐 URLs y Gateway

- **Tu Gateway Pinata**: `beige-electoral-sawfish-43.mypinata.cloud`
- **Formato de URLs**: `https://beige-electoral-sawfish-43.mypinata.cloud/ipfs/QmHash...`
- **API Endpoint**: `https://api.pinata.cloud/`

## 🧪 Testing

### Interfaz de Testing Disponible

Ve a: `http://localhost:3000/dev-testing/real-estate-nft-advanced`

Funcionalidades:

- ✅ Formulario completo de propiedades
- ✅ Upload de imágenes
- ✅ Generación automática de metadatos
- ✅ Simulación de upload a Pinata
- ✅ Ejemplos precargados

### Ejemplos de Propiedades

1. **🏡 Casa Familiar** - $250k, 3 hab, 2 baños
2. **🏢 Departamento** - $180k, 2 hab, 2 baños  
3. **🏰 Villa de Lujo** - $850k, 5 hab, 4 baños

## 📁 Archivos Clave

```bash
packages/nextjs/
├── services/
│   └── pinataService.ts          # Servicio principal de Pinata
├── app/dev-testing/
│   └── real-estate-nft-advanced/
│       └── page.tsx              # Interfaz de testing avanzada
├── .env.example                  # Template de variables
└── .env.local                    # Tu configuración (no commitear)
```

## 🚀 Uso en Producción

Para usar en producción:

1. **Configura variables de entorno** en tu plataforma de deployment
2. **Implementa manejo de errores** robusto
3. **Agrega validación de archivos** (tamaño, tipo)
4. **Considera rate limiting** de Pinata API
5. **Implementa retry logic** para uploads fallidos

## 💡 Beneficios

- **Descentralización**: Los metadatos no dependen de tu servidor
- **Permanencia**: Los datos estarán disponibles indefinidamente
- **Estándares**: Compatible con OpenSea, Rarible y otros marketplaces
- **Escalabilidad**: Pinata maneja la infraestructura IPFS
- **Confiabilidad**: Gateway dedicado para mejor performance

## 🔗 Enlaces Útiles

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [ERC-721 Metadata Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)

---

- **¡Tu plataforma de bienes raíces ahora tiene almacenamiento descentralizado profesional! 🎉**
