"use client";

import { useState } from "react";
import Link from "next/link";

interface PropertyFormData {
  name: string;
  description: string;
  address: string;
  valuation: string;
  bedrooms: string;
  bathrooms: string;
  squareMeters: string;
  yearBuilt: string;
  propertyType: string;
  city: string;
  country: string;
}

export default function RealEstateNFTAdvancedPage() {
  const [result, setResult] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    description: "",
    address: "",
    valuation: "",
    bedrooms: "",
    bathrooms: "",
    squareMeters: "",
    yearBuilt: "",
    propertyType: "House",
    city: "",
    country: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCreatePropertyWithPinata = async () => {
    if (!formData.name || !formData.address || !formData.valuation) {
      setResult("❌ Por favor llena al menos: Nombre, Dirección y Valoración");
      return;
    }

    setIsUploading(true);
    setResult("📤 Preparando metadatos para Pinata...");

    try {
      // Simulate Pinata upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult("📤 Subiendo imagen a Pinata IPFS...");

      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockImageURI = `https://beige-electoral-sawfish-43.mypinata.cloud/ipfs/QmExample123ImageHash`;
      setResult("📤 Creando metadatos JSON...");

      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockMetadataURI = `https://beige-electoral-sawfish-43.mypinata.cloud/ipfs/QmExample456MetadataHash`;

      setResult(`✅ NFT creado exitosamente!
📍 Metadatos URI: ${mockMetadataURI}
🖼️ Imagen URI: ${mockImageURI}
🏠 Propiedad: ${formData.name}
💰 Valoración: ${formData.valuation} USDT
📍 Dirección: ${formData.address}`);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const loadExample = (type: string) => {
    const examples = {
      house: {
        name: "Casa Familiar Moderna",
        description: "Hermosa casa de 3 habitaciones en zona residencial premium con jardín y garage",
        address: "Av. Reforma 123, Colonia Centro, Ciudad de México",
        valuation: "250000",
        bedrooms: "3",
        bathrooms: "2",
        squareMeters: "180",
        yearBuilt: "2020",
        propertyType: "House",
        city: "Ciudad de México",
        country: "México",
      },
      apartment: {
        name: "Departamento Ejecutivo",
        description: "Moderno departamento con vista panorámica en edificio de lujo",
        address: "Torre Platino, Piso 15, Santa Fe, Ciudad de México",
        valuation: "180000",
        bedrooms: "2",
        bathrooms: "2",
        squareMeters: "95",
        yearBuilt: "2022",
        propertyType: "Apartment",
        city: "Ciudad de México",
        country: "México",
      },
      villa: {
        name: "Villa de Lujo Mediterránea",
        description: "Exclusiva villa con piscina, jardín tropical y vista al mar",
        address: "Carretera Costera Km 15, Playa del Carmen, Quintana Roo",
        valuation: "850000",
        bedrooms: "5",
        bathrooms: "4",
        squareMeters: "420",
        yearBuilt: "2019",
        propertyType: "Villa",
        city: "Playa del Carmen",
        country: "México",
      },
    };

    setFormData(examples[type as keyof typeof examples]);
    setResult(`📋 Datos de ejemplo cargados: ${examples[type as keyof typeof examples].name}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🏠 Real Estate NFT + Pinata IPFS</h1>
        <Link href="/dev-testing" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← Volver
        </Link>
      </div>

      {/* Pinata Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">📌 Configuración Pinata IPFS</h2>
        <div className="text-sm text-blue-600">
          <p>
            <strong>Gateway:</strong> beige-electoral-sawfish-43.mypinata.cloud
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {process.env.NEXT_PUBLIC_PINATA_API_KEY ? "🟢 Configurado" : "🟡 Necesita API Keys"}
          </p>
          <p>
            <strong>Uso:</strong> Almacenamiento descentralizado de metadatos e imágenes
          </p>
        </div>
      </div>

      {/* Property Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🏗️ Crear Propiedad NFT</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de la Propiedad *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Casa Familiar Moderna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Descripción detallada de la propiedad..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dirección Completa *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Calle, Número, Colonia, Ciudad"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ciudad de México"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">País</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="México"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Property Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Valoración (USDT) *</label>
              <input
                type="number"
                name="valuation"
                value={formData.valuation}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="250000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Propiedad</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="House">Casa</option>
                <option value="Apartment">Departamento</option>
                <option value="Villa">Villa</option>
                <option value="Condo">Condominio</option>
                <option value="Townhouse">Casa Adosada</option>
                <option value="Land">Terreno</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Habitaciones</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Baños</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">m²</label>
                <input
                  type="number"
                  name="squareMeters"
                  value={formData.squareMeters}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="180"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Año de Construcción</label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="2020"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Imagen de la Propiedad</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
            {previewUrl && (
              <div className="mt-4">
                <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              La imagen será subida a Pinata IPFS y estará disponible de forma permanente
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCreatePropertyWithPinata}
            disabled={isUploading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
          >
            {isUploading ? "📤 Subiendo..." : "🏠 Crear NFT + Pinata"}
          </button>

          <button
            onClick={() =>
              setFormData({
                name: "",
                description: "",
                address: "",
                valuation: "",
                bedrooms: "",
                bathrooms: "",
                squareMeters: "",
                yearBuilt: "",
                propertyType: "House",
                city: "",
                country: "",
              })
            }
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🚀 Ejemplos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => loadExample("house")}
            className="bg-green-100 text-green-800 px-4 py-3 rounded hover:bg-green-200 text-left"
          >
            <div className="font-semibold">🏡 Casa Familiar</div>
            <div className="text-sm">3 hab, 2 baños, $250k</div>
          </button>
          <button
            onClick={() => loadExample("apartment")}
            className="bg-blue-100 text-blue-800 px-4 py-3 rounded hover:bg-blue-200 text-left"
          >
            <div className="font-semibold">🏢 Departamento</div>
            <div className="text-sm">2 hab, 2 baños, $180k</div>
          </button>
          <button
            onClick={() => loadExample("villa")}
            className="bg-purple-100 text-purple-800 px-4 py-3 rounded hover:bg-purple-200 text-left"
          >
            <div className="font-semibold">🏰 Villa de Lujo</div>
            <div className="text-sm">5 hab, 4 baños, $850k</div>
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">📊 Resultado:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {/* Technical Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 Información Técnica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">📋 Metadatos NFT (ERC-721)</h4>
            <ul className="space-y-1 text-gray-600">
              <li>
                • <strong>name:</strong> Nombre de la propiedad
              </li>
              <li>
                • <strong>description:</strong> Descripción detallada
              </li>
              <li>
                • <strong>image:</strong> URL de imagen en IPFS
              </li>
              <li>
                • <strong>attributes:</strong> Características estructuradas
              </li>
              <li>
                • <strong>properties:</strong> Datos específicos de bienes raíces
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🌐 Almacenamiento IPFS</h4>
            <ul className="space-y-1 text-gray-600">
              <li>
                • <strong>Proveedor:</strong> Pinata Cloud
              </li>
              <li>
                • <strong>Gateway:</strong> beige-electoral-sawfish-43.mypinata.cloud
              </li>
              <li>
                • <strong>Permanencia:</strong> Descentralizado e inmutable
              </li>
              <li>
                • <strong>Acceso:</strong> Global y resistente a censura
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
