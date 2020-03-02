class Graph_temp {
    constructor(url) {
        this.url = url;
        this.get_data().then((rep) => {
            console.log(rep);
            this.data = this.format_data(rep);
            this.chart = this.disp_chars(this.data);
        });
    }

    async get_data() {
        var myHeaders = new Headers();

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            "mimeType": "multipart/form-data"
        };
        const response = await fetch(this.url, myInit);
        const myJson = await response.json();
        // console.log(myJson);
        return myJson
    }

    format_data(e) {

        var labels = e.map(function (val) {
            return moment.unix(val.timestamp).format("DD/MM/YYYY HH:mm");
        });
        var data_time = e.map(function (val) {
            return val.temperature;
        });
        var data_temp = e.map(function (val) {
            return val.humidite;
        });

        return [labels, data_time, data_temp]
    }

    disp_chars(data) {
        console.log(data);
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data[0],
                datasets: [{
                    label: "Température",
                    data: data[1],
                    borderColor: 'rgb(250,130,20)',
                    borderWidth: 1
                }, {
                    label: "Humidité",
                    data: data[2],
                    borderColor: 'rgb(40,130,200)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
        return myChart
    }
}