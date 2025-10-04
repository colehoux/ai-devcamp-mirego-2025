import pandas as pd
import plotly.graph_objects as go

# Coordonnées géographiques des pays
coordinates = {
    'Canada': {'lat': 56.1304, 'lon': -106.3468},
    'États-Unis': {'lat': 37.0902, 'lon': -95.7129},
    'Union européenne': {'lat': 50.8503, 'lon': 4.3517},  # Bruxelles
    'Allemagne': {'lat': 51.1657, 'lon': 10.4515},
    'Pays-Bas': {'lat': 52.1326, 'lon': 5.2913},
    'France': {'lat': 46.2276, 'lon': 2.2137},
    'Italie': {'lat': 41.8719, 'lon': 12.5674},
    'Belgique': {'lat': 50.5039, 'lon': 4.4699},
    'Espagne': {'lat': 40.4637, 'lon': -3.7492},
    'Chine': {'lat': 35.8617, 'lon': 104.1954},
    'Royaume-Uni': {'lat': 55.3781, 'lon': -3.4360},
    'Mexique': {'lat': 23.6345, 'lon': -102.5528},
    'Japon': {'lat': 36.2048, 'lon': 138.2529},
    'Corée du Sud': {'lat': 35.9078, 'lon': 127.7669},
    'Hong-Kong': {'lat': 22.3193, 'lon': 114.1694},
    'Brésil': {'lat': -14.2350, 'lon': -51.9253},
    'Algérie': {'lat': 28.0339, 'lon': 1.6596},
    'Norvège': {'lat': 60.4720, 'lon': 8.4689},
    'Inde': {'lat': 20.5937, 'lon': 78.9629},
    'Suisse': {'lat': 46.8182, 'lon': 8.2275},
    'Arabie Saoudite': {'lat': 23.8859, 'lon': 45.0792},
    'Türkiye': {'lat': 38.9637, 'lon': 35.2433},
    'Taïwan': {'lat': 23.6978, 'lon': 120.9605},
    'Pérou': {'lat': -9.1900, 'lon': -75.0152},
    'Australie': {'lat': -25.2744, 'lon': 133.7751},
    'Iraq': {'lat': 33.2232, 'lon': 43.6793},
    'Indonésie': {'lat': -0.7893, 'lon': 113.9213},
    'Singapour': {'lat': 1.3521, 'lon': 103.8198},
    'Fédération de Russie': {'lat': 61.5240, 'lon': 105.3188}
}

# Charger les données
df = pd.read_csv('12100127-fra/12100127.csv', sep=';', encoding='utf-8-sig')

# Filtrer pour la période la plus récente (2025-04), désaisonnalisé, balance des paiements
df_recent = df[
    (df['PÉRIODE DE RÉFÉRENCE'] == '2025-04') &
    (df['Désaisonnalisation'] == 'Désaisonnalisées') &
    (df['Base'] == 'Balance des paiements') &
    (df['Principaux partenaires commerciaux'] != 'Tous les pays')
].copy()

# Convertir les valeurs en numérique
df_recent['VALEUR'] = pd.to_numeric(df_recent['VALEUR'], errors='coerce')

# Séparer importations et exportations
imports = df_recent[df_recent['Commerce'] == 'Importations'].copy()
exports = df_recent[df_recent['Commerce'] == 'Exportations'].copy()

# Créer la figure
fig = go.Figure()

# Position du Canada
canada_lat = coordinates['Canada']['lat']
canada_lon = coordinates['Canada']['lon']

# Ajouter les flux d'importation (rouge)
for _, row in imports.iterrows():
    country = row['Principaux partenaires commerciaux']
    if country in coordinates:
        value = row['VALEUR']

        # Ligne de flux
        fig.add_trace(go.Scattergeo(
            lon=[coordinates[country]['lon'], canada_lon],
            lat=[coordinates[country]['lat'], canada_lat],
            mode='lines',
            line=dict(width=value/2000, color='red'),
            opacity=0.6,
            name=f'{country} → Canada',
            hovertemplate=f'<b>Import: {country} → Canada</b><br>Valeur: {value:,.1f} M$<extra></extra>',
            showlegend=False
        ))

# Ajouter les flux d'exportation (vert)
for _, row in exports.iterrows():
    country = row['Principaux partenaires commerciaux']
    if country in coordinates:
        value = row['VALEUR']

        # Ligne de flux
        fig.add_trace(go.Scattergeo(
            lon=[canada_lon, coordinates[country]['lon']],
            lat=[canada_lat, coordinates[country]['lat']],
            mode='lines',
            line=dict(width=value/2000, color='green'),
            opacity=0.6,
            name=f'Canada → {country}',
            hovertemplate=f'<b>Export: Canada → {country}</b><br>Valeur: {value:,.1f} M$<extra></extra>',
            showlegend=False
        ))

# Ajouter les points pour les pays
all_countries = set(imports['Principaux partenaires commerciaux'].unique()) | set(exports['Principaux partenaires commerciaux'].unique())

for country in all_countries:
    if country in coordinates:
        import_val = imports[imports['Principaux partenaires commerciaux'] == country]['VALEUR'].values
        export_val = exports[exports['Principaux partenaires commerciaux'] == country]['VALEUR'].values

        import_val = import_val[0] if len(import_val) > 0 else 0
        export_val = export_val[0] if len(export_val) > 0 else 0
        balance = export_val - import_val

        fig.add_trace(go.Scattergeo(
            lon=[coordinates[country]['lon']],
            lat=[coordinates[country]['lat']],
            mode='markers',
            marker=dict(
                size=10,
                color='blue',
                line=dict(width=1, color='white')
            ),
            name=country,
            text=country,
            hovertemplate=(
                f'<b>{country}</b><br>'
                f'Importations: {import_val:,.1f} M$<br>'
                f'Exportations: {export_val:,.1f} M$<br>'
                f'Balance: {balance:,.1f} M$<extra></extra>'
            ),
            showlegend=False
        ))

# Ajouter le point du Canada en plus gros
fig.add_trace(go.Scattergeo(
    lon=[canada_lon],
    lat=[canada_lat],
    mode='markers+text',
    marker=dict(size=20, color='darkblue', line=dict(width=2, color='white')),
    text=['Canada'],
    textposition='top center',
    name='Canada',
    hoverinfo='text',
    hovertext='<b>Canada</b><br>Centre commercial',
    showlegend=False
))

# Ajouter une légende manuelle
fig.add_trace(go.Scattergeo(
    lon=[None], lat=[None],
    mode='lines',
    line=dict(color='red', width=3),
    name='Importations',
    showlegend=True
))

fig.add_trace(go.Scattergeo(
    lon=[None], lat=[None],
    mode='lines',
    line=dict(color='green', width=3),
    name='Exportations',
    showlegend=True
))

# Mise en page
fig.update_layout(
    title={
        'text': 'Commerce international du Canada - Avril 2025<br><sub>Données désaisonnalisées (millions $)</sub>',
        'x': 0.5,
        'xanchor': 'center'
    },
    geo=dict(
        projection_type='natural earth',
        showland=True,
        landcolor='rgb(243, 243, 243)',
        coastlinecolor='rgb(204, 204, 204)',
        showocean=True,
        oceancolor='rgb(230, 245, 255)',
        showcountries=True,
        countrycolor='rgb(204, 204, 204)',
    ),
    height=700,
    width=1400,
    showlegend=True,
    legend=dict(
        x=0.02,
        y=0.98,
        bgcolor='rgba(255, 255, 255, 0.8)',
        bordercolor='black',
        borderwidth=1
    )
)

# Sauvegarder et afficher
fig.write_html('carte_flux_commerce_canada.html')
print("✅ Carte générée: carte_flux_commerce_canada.html")
print("\n📊 Statistiques avril 2025:")
print(f"Total importations: {imports['VALEUR'].sum():,.1f} M$")
print(f"Total exportations: {exports['VALEUR'].sum():,.1f} M$")
print(f"Balance commerciale: {exports['VALEUR'].sum() - imports['VALEUR'].sum():,.1f} M$")
