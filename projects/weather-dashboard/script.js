class WeatherDashboard {
    constructor() {
        this.currentUnit = 'metric'; // 'metric' for °C, 'imperial' for °F
        this.currentCity = 'New York';
        this.historyChart = null;
        this.hourlyScrollPosition = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWeatherData();
        this.initHistoryChart();
    }

    setupEventListeners() {
        // Unit toggle
        document.getElementById('unitC').addEventListener('click', () => {
            this.setUnit('metric');
        });
        
        document.getElementById('unitF').addEventListener('click', () => {
            this.setUnit('imperial');
        });

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            const cityInput = document.getElementById('cityInput').value.trim();
            if (cityInput) {
                this.currentCity = cityInput;
                this.loadWeatherData();
            }
        });

        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const cityInput = document.getElementById('cityInput').value.trim();
                if (cityInput) {
                    this.currentCity = cityInput;
                    this.loadWeatherData();
                }
            }
        });

        // Recent city buttons
        document.querySelectorAll('.recent-city').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCity = e.target.dataset.city;
                document.getElementById('cityInput').value = this.currentCity;
                this.loadWeatherData();
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadWeatherData();
        });

        // Hourly forecast scroll buttons
        document.getElementById('prevHour').addEventListener('click', () => {
            this.scrollHourly('left');
        });

        document.getElementById('nextHour').addEventListener('click', () => {
            this.scrollHourly('right');
        });

        // Map layer buttons
        document.querySelectorAll('.map-layer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.map-layer').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.showNotification(`Map layer switched to ${e.target.dataset.layer} view`);
            });
        });

        // History controls
        document.getElementById('historyMetric').addEventListener('change', () => {
            this.updateHistoryChart();
        });

        document.getElementById('historyPeriod').addEventListener('change', () => {
            this.updateHistoryChart();
        });

        // Notification close button
        document.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification();
        });
    }

    setUnit(unit) {
        if (this.currentUnit !== unit) {
            this.currentUnit = unit;
            
            // Update unit buttons
            document.getElementById('unitC').classList.toggle('active', unit === 'metric');
            document.getElementById('unitF').classList.toggle('active', unit === 'imperial');
            
            // Reload weather data with new units
            this.loadWeatherData();
            
            this.showNotification(`Switched to ${unit === 'metric' ? '°C' : '°F'}`);
        }
    }

    async loadWeatherData() {
        // Show loading state
        const currentWeatherEl = document.getElementById('currentWeather');
        currentWeatherEl.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading weather data for ${this.currentCity}...</p>
            </div>
        `;

        try {
            // In a real application, you would use a real weather API here
            // For demo purposes, we'll use mock data
            await this.simulateAPIDelay();
            
            const weatherData = this.getMockWeatherData();
            this.renderCurrentWeather(weatherData.current);
            this.renderForecast(weatherData.forecast);
            this.renderWeatherDetails(weatherData.current);
            this.renderHourlyForecast(weatherData.hourly);
            this.renderAirQuality(weatherData.airQuality);
            this.renderWeatherAlerts(weatherData.alerts);
            this.updateHistoryChart();
            
            this.showNotification(`Weather data loaded for ${this.currentCity}`);
        } catch (error) {
            console.error('Error loading weather data:', error);
            this.showNotification('Failed to load weather data. Using demo data.', 'error');
            
            // Fall back to demo data
            const demoData = this.getDemoWeatherData();
            this.renderCurrentWeather(demoData.current);
            this.renderForecast(demoData.forecast);
            this.renderWeatherDetails(demoData.current);
            this.renderHourlyForecast(demoData.hourly);
            this.renderAirQuality(demoData.airQuality);
            this.renderWeatherAlerts(demoData.alerts);
            this.updateHistoryChart();
        }
    }

    simulateAPIDelay() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    getMockWeatherData() {
        const now = new Date();
        const isMetric = this.currentUnit === 'metric';
        const tempUnit = isMetric ? '°C' : '°F';
        const speedUnit = isMetric ? 'km/h' : 'mph';
        
        // Generate realistic weather data based on city and season
        const baseTemp = this.getBaseTemperature(this.currentCity);
        const condition = this.getRandomCondition();
        
        return {
            location: {
                city: this.currentCity,
                country: this.getCountry(this.currentCity),
                localTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            current: {
                temp: this.convertTemp(this.addVariation(baseTemp, 5), isMetric),
                feelsLike: this.convertTemp(this.addVariation(baseTemp, 3), isMetric),
                condition: condition,
                icon: this.getWeatherIcon(condition),
                humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
                windSpeed: this.convertSpeed((Math.random() * 15 + 5).toFixed(1), isMetric),
                windDirection: this.getRandomDirection(),
                pressure: Math.floor(Math.random() * 30) + 1000, // 1000-1030 hPa
                uvIndex: Math.floor(Math.random() * 8) + 2, // 2-10
                visibility: (Math.random() * 10 + 5).toFixed(1), // 5-15 km
                sunrise: '06:45',
                sunset: '18:30',
                highTemp: this.convertTemp(baseTemp + 5, isMetric),
                lowTemp: this.convertTemp(baseTemp - 5, isMetric)
            },
            forecast: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayTemp = this.addVariation(baseTemp, 7);
                
                return {
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    highTemp: this.convertTemp(dayTemp + 3, isMetric),
                    lowTemp: this.convertTemp(dayTemp - 3, isMetric),
                    condition: this.getRandomCondition(),
                    icon: this.getWeatherIcon(this.getRandomCondition()),
                    precipitation: Math.floor(Math.random() * 60) // 0-60%
                };
            }),
            hourly: Array.from({ length: 24 }, (_, i) => {
                const hour = (now.getHours() + i) % 24;
                const hourTemp = baseTemp + Math.sin(i * Math.PI / 12) * 8; // Sinusoidal temperature curve
                
                return {
                    time: `${hour}:00`,
                    temp: this.convertTemp(hourTemp, isMetric),
                    condition: this.getRandomCondition(),
                    icon: this.getWeatherIcon(this.getRandomCondition()),
                    precipitation: i < 6 || i > 18 ? Math.floor(Math.random() * 40) : Math.floor(Math.random() * 20),
                    humidity: Math.floor(Math.random() * 30) + 50,
                    windSpeed: this.convertSpeed((Math.random() * 10 + 5).toFixed(1), isMetric)
                };
            }),
            airQuality: {
                aqi: Math.floor(Math.random() * 150) + 50, // 50-200
                level: this.getAQILevel(100),
                pollutants: {
                    pm25: (Math.random() * 30 + 10).toFixed(1),
                    pm10: (Math.random() * 50 + 20).toFixed(1),
                    o3: (Math.random() * 60 + 20).toFixed(1),
                    no2: (Math.random() * 40 + 10).toFixed(1),
                    so2: (Math.random() * 20 + 5).toFixed(1)
                }
            },
            alerts: Math.random() > 0.7 ? [
                {
                    type: 'warning',
                    title: 'Weather Advisory',
                    description: 'Potential for severe thunderstorms this afternoon.'
                }
            ] : []
        };
    }

    getDemoWeatherData() {
        // Fixed demo data for when API fails
        return {
            location: {
                city: this.currentCity,
                country: 'Demo Country',
                localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            current: {
                temp: this.currentUnit === 'metric' ? '22' : '72',
                feelsLike: this.currentUnit === 'metric' ? '24' : '75',
                condition: 'Partly Cloudy',
                icon: 'wi-day-cloudy',
                humidity: '65',
                windSpeed: this.currentUnit === 'metric' ? '12' : '7.5',
                windDirection: 'NW',
                pressure: '1013',
                uvIndex: '6',
                visibility: this.currentUnit === 'metric' ? '10' : '6.2',
                sunrise: '06:30',
                sunset: '18:45',
                highTemp: this.currentUnit === 'metric' ? '25' : '77',
                lowTemp: this.currentUnit === 'metric' ? '18' : '64'
            },
            forecast: Array.from({ length: 7 }, (_, i) => ({
                date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
                fullDate: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                highTemp: this.currentUnit === 'metric' ? '24' : '75',
                lowTemp: this.currentUnit === 'metric' ? '17' : '63',
                condition: ['Sunny', 'Cloudy', 'Rain', 'Partly Cloudy', 'Sunny', 'Cloudy', 'Rain'][i],
                icon: ['wi-day-sunny', 'wi-cloudy', 'wi-rain', 'wi-day-cloudy', 'wi-day-sunny', 'wi-cloudy', 'wi-rain'][i],
                precipitation: [0, 30, 80, 20, 0, 40, 90][i]
            })),
            hourly: Array.from({ length: 24 }, (_, i) => ({
                time: `${(i + 8) % 24}:00`,
                temp: this.currentUnit === 'metric' ? Math.floor(18 + Math.sin(i * Math.PI / 12) * 7) : Math.floor(64 + Math.sin(i * Math.PI / 12) * 12),
                condition: i < 6 ? 'Clear' : i < 12 ? 'Sunny' : i < 18 ? 'Partly Cloudy' : 'Clear',
                icon: i < 6 ? 'wi-night-clear' : i < 12 ? 'wi-day-sunny' : i < 18 ? 'wi-day-cloudy' : 'wi-night-clear',
                precipitation: i < 6 ? 0 : i < 12 ? 10 : i < 18 ? 30 : 10,
                humidity: 60 + Math.sin(i * Math.PI / 12) * 10,
                windSpeed: this.currentUnit === 'metric' ? (10 + Math.sin(i * Math.PI / 12) * 5).toFixed(1) : (6 + Math.sin(i * Math.PI / 12) * 3).toFixed(1)
            })),
            airQuality: {
                aqi: 85,
                level: 'Moderate',
                pollutants: {
                    pm25: '12.5',
                    pm10: '25.0',
                    o3: '45.0',
                    no2: '22.5',
                    so2: '8.5'
                }
            },
            alerts: []
        };
    }

    getBaseTemperature(city) {
        // Return base temperature based on city (in °C)
        const cityTemps = {
            'New York': 15,
            'London': 10,
            'Tokyo': 18,
            'Sydney': 20,
            'Paris': 12,
            'Berlin': 11,
            'Moscow': 5,
            'Dubai': 30,
            'Mumbai': 28,
            'Singapore': 27
        };
        return cityTemps[city] || 15;
    }

    getCountry(city) {
        const cityCountries = {
            'New York': 'United States',
            'London': 'United Kingdom',
            'Tokyo': 'Japan',
            'Sydney': 'Australia',
            'Paris': 'France',
            'Berlin': 'Germany',
            'Moscow': 'Russia',
            'Dubai': 'UAE',
            'Mumbai': 'India',
            'Singapore': 'Singapore'
        };
        return cityCountries[city] || 'Unknown';
    }

    getRandomCondition() {
        const conditions = [
            'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
            'Rain', 'Thunderstorm', 'Snow', 'Fog', 'Clear'
        ];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    getWeatherIcon(condition) {
        const iconMap = {
            'Sunny': 'wi-day-sunny',
            'Partly Cloudy': 'wi-day-cloudy',
            'Cloudy': 'wi-cloudy',
            'Light Rain': 'wi-day-rain',
            'Rain': 'wi-rain',
            'Thunderstorm': 'wi-thunderstorm',
            'Snow': 'wi-snow',
            'Fog': 'wi-fog',
            'Clear': 'wi-night-clear'
        };
        return iconMap[condition] || 'wi-day-sunny';
    }

    getRandomDirection() {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    getAQILevel(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        return 'Very Unhealthy';
    }

    addVariation(base, range) {
        return base + (Math.random() * range * 2 - range);
    }

    convertTemp(celsius, toMetric) {
        if (toMetric) {
            return Math.round(celsius);
        } else {
            // Convert to Fahrenheit
            return Math.round((celsius * 9/5) + 32);
        }
    }

    convertSpeed(kmh, toMetric) {
        if (toMetric) {
            return parseFloat(kmh).toFixed(1);
        } else {
            // Convert to mph
            return (parseFloat(kmh) * 0.621371).toFixed(1);
        }
    }

    renderCurrentWeather(data) {
        const tempUnit = this.currentUnit === 'metric' ? '°C' : '°F';
        const speedUnit = this.currentUnit === 'metric' ? 'km/h' : 'mph';
        
        document.getElementById('currentWeather').innerHTML = `
            <div class="weather-content">
                <div class="weather-main">
                    <div class="weather-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${this.currentCity}, ${data.location.country}</span>
                    </div>
                    <div class="weather-temp">${data.temp}${tempUnit}</div>
                    <div class="weather-condition">${data.condition}</div>
                    <div class="weather-high-low">
                        <span>H: ${data.highTemp}${tempUnit}</span>
                        <span>L: ${data.lowTemp}${tempUnit}</span>
                    </div>
                    <div class="weather-feels-like">
                        Feels like ${data.feelsLike}${tempUnit}
                    </div>
                </div>
                <div class="weather-stats">
                    <div class="weather-stat">
                        <div class="stat-icon">
                            <i class="wi wi-humidity"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${data.humidity}%</div>
                            <div class="stat-label">Humidity</div>
                        </div>
                    </div>
                    <div class="weather-stat">
                        <div class="stat-icon">
                            <i class="wi wi-strong-wind"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${data.windSpeed} ${speedUnit}</div>
                            <div class="stat-label">Wind Speed</div>
                        </div>
                    </div>
                    <div class="weather-stat">
                        <div class="stat-icon">
                            <i class="wi wi-barometer"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${data.pressure} hPa</div>
                            <div class="stat-label">Pressure</div>
                        </div>
                    </div>
                    <div class="weather-stat">
                        <div class="stat-icon">
                            <i class="wi wi-sunrise"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${data.sunrise}</div>
                            <div class="stat-label">Sunrise</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderForecast(forecastData) {
        const tempUnit = this.currentUnit === 'metric' ? '°C' : '°F';
        const container = document.getElementById('forecastContainer');
        
        container.innerHTML = forecastData.map(day => `
            <div class="forecast-day">
                <div class="forecast-date">${day.date}</div>
                <div class="forecast-date-small">${day.fullDate}</div>
                <div class="forecast-icon">
                    <i class="wi ${day.icon}"></i>
                </div>
                <div class="forecast-temp">
                    <span class="forecast-high">${day.highTemp}${tempUnit}</span>
                    <span class="forecast-low">${day.lowTemp}${tempUnit}</span>
                </div>
                <div class="forecast-condition">${day.condition}</div>
                <div class="forecast-precipitation">
                    <i class="wi wi-raindrops"></i> ${day.precipitation}%
                </div>
            </div>
        `).join('');
    }

    renderWeatherDetails(data) {
        const tempUnit = this.currentUnit === 'metric' ? '°C' : '°F';
        const speedUnit = this.currentUnit === 'metric' ? 'km/h' : 'mph';
        const visibilityUnit = this.currentUnit === 'metric' ? 'km' : 'mi';
        
        const details = [
            { icon: 'wi-thermometer', label: 'Feels Like', value: `${data.feelsLike}${tempUnit}` },
            { icon: 'wi-humidity', label: 'Humidity', value: `${data.humidity}%` },
            { icon: 'wi-barometer', label: 'Pressure', value: `${data.pressure} hPa` },
            { icon: 'wi-strong-wind', label: 'Wind', value: `${data.windSpeed} ${speedUnit} ${data.windDirection}` },
            { icon: 'wi-day-sunny', label: 'UV Index', value: data.uvIndex },
            { icon: 'wi-visibility', label: 'Visibility', value: `${data.visibility} ${visibilityUnit}` },
            { icon: 'wi-sunrise', label: 'Sunrise', value: data.sunrise },
            { icon: 'wi-sunset', label: 'Sunset', value: data.sunset }
        ];
        
        const container = document.getElementById('weatherDetails');
        container.innerHTML = details.map(detail => `
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="wi ${detail.icon}"></i>
                </div>
                <div class="detail-content">
                    <div class="detail-value">${detail.value}</div>
                    <div class="detail-label">${detail.label}</div>
                </div>
            </div>
        `).join('');
    }

    renderHourlyForecast(hourlyData) {
        const tempUnit = this.currentUnit === 'metric' ? '°C' : '°F';
        const container = document.getElementById('hourlyScroll');
        
        container.innerHTML = hourlyData.map(hour => `
            <div class="hourly-item">
                <div class="hourly-time">${hour.time}</div>
                <div class="hourly-icon">
                    <i class="wi ${hour.icon}"></i>
                </div>
                <div class="hourly-temp">${hour.temp}${tempUnit}</div>
                <div class="hourly-precip">
                    <i class="wi wi-raindrop"></i> ${hour.precipitation}%
                </div>
                <div class="hourly-humidity">
                    <i class="wi wi-humidity"></i> ${hour.humidity}%
                </div>
                <div class="hourly-wind">
                    <i class="wi wi-strong-wind"></i> ${hour.windSpeed}
                </div>
            </div>
        `).join('');
        
        // Reset scroll position
        container.scrollLeft = 0;
        this.hourlyScrollPosition = 0;
    }

    scrollHourly(direction) {
        const container = document.getElementById('hourlyScroll');
        const scrollAmount = 200;
        
        if (direction === 'left') {
            this.hourlyScrollPosition = Math.max(0, this.hourlyScrollPosition - scrollAmount);
        } else {
            this.hourlyScrollPosition = Math.min(
                container.scrollWidth - container.clientWidth,
                this.hourlyScrollPosition + scrollAmount
            );
        }
        
        container.scrollTo({
            left: this.hourlyScrollPosition,
            behavior: 'smooth'
        });
    }

    renderAirQuality(data) {
        const container = document.getElementById('airQuality');
        
        // Determine AQI color
        let aqiColor = '#10b981'; // Good
        if (data.aqi > 100) aqiColor = '#f59e0b'; // Moderate
        if (data.aqi > 150) aqiColor = '#ef4444'; // Unhealthy
        
        container.innerHTML = `
            <div class="aqi-index" style="color: ${aqiColor}">${data.aqi}</div>
            <div class="aqi-content">
                <div class="aqi-level">${data.level}</div>
                <div class="aqi-description">
                    Air quality is ${data.level.toLowerCase()}. ${
                        data.aqi <= 50 ? 'Air quality is satisfactory.' :
                        data.aqi <= 100 ? 'Air quality is acceptable.' :
                        'Some pollutants may be a moderate health concern.'
                    }
                </div>
                <div class="aqi-pollutants">
                    <div class="pollutant">PM2.5: ${data.pollutants.pm25}</div>
                    <div class="pollutant">PM10: ${data.pollutants.pm10}</div>
                    <div class="pollutant">O₃: ${data.pollutants.o3}</div>
                    <div class="pollutant">NO₂: ${data.pollutants.no2}</div>
                    <div class="pollutant">SO₂: ${data.pollutants.so2}</div>
                </div>
            </div>
        `;
        
        // Update background gradient based on AQI
        container.style.background = `linear-gradient(135deg, ${aqiColor}, ${this.blendColors(aqiColor, '#3b82f6', 0.5)})`;
    }

    blendColors(color1, color2, weight) {
        // Simple color blending function
        const w1 = weight;
        const w2 = 1 - w1;
        
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        const r = Math.round(rgb1.r * w1 + rgb2.r * w2);
        const g = Math.round(rgb1.g * w1 + rgb2.g * w2);
        const b = Math.round(rgb1.b * w1 + rgb2.b * w2);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    renderWeatherAlerts(alerts) {
        const container = document.getElementById('weatherAlerts');
        
        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="alerts-container">
                    <div class="alert-card" style="background-color: rgba(16, 185, 129, 0.1); border-left-color: var(--success-color);">
                        <div class="alert-icon">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">No Weather Alerts</div>
                            <div class="alert-description">There are no active weather alerts for ${this.currentCity} at this time.</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="alerts-container">
                    ${alerts.map(alert => `
                        <div class="alert-card">
                            <div class="alert-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">${alert.title}</div>
                                <div class="alert-description">${alert.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    initHistoryChart() {
        const ctx = document.getElementById('historyChart').getContext('2d');
        this.historyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature',
                    data: [],
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}${document.getElementById('unitC').classList.contains('active') ? '°C' : '°F'}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + (document.getElementById('unitC').classList.contains('active') ? '°C' : '°F');
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
        
        this.updateHistoryChart();
    }

    updateHistoryChart() {
        const metric = document.getElementById('historyMetric').value;
        const period = parseInt(document.getElementById('historyPeriod').value);
        
        // Generate historical data based on selected metric and period
        const labels = [];
        const data = [];
        
        const now = new Date();
        const isMetric = this.currentUnit === 'metric';
        const tempUnit = isMetric ? '°C' : '°F';
        
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Generate realistic historical data
            let value;
            const baseTemp = this.getBaseTemperature(this.currentCity);
            
            switch(metric) {
                case 'temperature':
                    value = this.convertTemp(baseTemp + Math.sin(i * 0.5) * 10 + Math.random() * 3, isMetric);
                    break;
                case 'humidity':
                    value = Math.floor(Math.random() * 30) + 50; // 50-80%
                    break;
                case 'precipitation':
                    value = Math.floor(Math.random() * 30); // 0-30mm
                    break;
                default:
                    value = this.convertTemp(baseTemp, isMetric);
            }
            
            data.push(value);
        }
        
        // Update chart data
        this.historyChart.data.labels = labels;
        this.historyChart.data.datasets[0].data = data;
        this.historyChart.data.datasets[0].label = metric.charAt(0).toUpperCase() + metric.slice(1);
        
        // Update colors based on metric
        let color, bgColor;
        switch(metric) {
            case 'temperature':
                color = 'var(--primary-color)';
                bgColor = 'rgba(59, 130, 246, 0.1)';
                break;
            case 'humidity':
                color = 'var(--secondary-color)';
                bgColor = 'rgba(139, 92, 246, 0.1)';
                break;
            case 'precipitation':
                color = 'var(--success-color)';
                bgColor = 'rgba(16, 185, 129, 0.1)';
                break;
        }
        
        this.historyChart.data.datasets[0].borderColor = color;
        this.historyChart.data.datasets[0].backgroundColor = bgColor;
        
        // Update Y-axis label
        const unit = metric === 'temperature' ? tempUnit : 
                    metric === 'humidity' ? '%' : 'mm';
        
        this.historyChart.options.scales.y.ticks.callback = function(value) {
            return value + unit;
        };
        
        this.historyChart.update();
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        messageEl.textContent = message;
        
        // Set color based on type
        notification.style.backgroundColor = type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)';
        
        notification.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        document.getElementById('notification').classList.remove('show');
    }
}

// Initialize the weather dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const weatherDashboard = new WeatherDashboard();
});