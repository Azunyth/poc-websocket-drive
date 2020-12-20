$(document).ready(function() {
    var socket = io({
        transportOptions: {
          polling: {
            extraHeaders: {
              'x-client-id': 'simulator'
            }
          }
        }
      });

    const createVehicle = function(e) {
        socket.emit('create_vehicle');
    }

    const moveVehicle = function(e) {
        let input = $(this).attr('data-to');
        if(input) {
            console.log(input);
            socket.emit('move_vehicle', {input: input});
        } else {
            alert('No input detected')
        }
    }

    $('.create-vehicle').off('click', createVehicle);
    $('.create-vehicle').on('click', createVehicle);

    $('.list-group').off('click', 'button.move-vehicle', moveVehicle);
    $('.list-group').on('click', 'button.move-vehicle', moveVehicle);

    lines = [];
    generateLines();

    socket.on('drive_update', function(data) {
        if(data.hasOwnProperty('lines')) {
            lines = data.lines;
        }
        generateLines();
    });
    

    function generateLines() {
        $('.lines').empty();
        if(lines.length) {
            lines.forEach(function(line) {
                if(line.hasOwnProperty('key')) {
                    let $lineList = $('ul.' + line.key);
                    if($lineList.length && line.hasOwnProperty('vehicles') && line.vehicles.length) {
                        line.vehicles.forEach(function(vehicle) {
                            let bg = vehicle.on_sensor ? '' : 'bg-danger';
                            let buttons = !vehicle.on_sensor ? showButtons(vehicle.zone, vehicle.input) : ''; 
                            $lineList.append(`<li class="list-group-item ${bg}">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <h5 class="mb-1">Vehicle: ${vehicle.vehicle_id}</h5>
                                                    <div>
                                                        ${buttons}
                                                    </div>
                                                </div>
                                            </li>`);
                        });
                    }
                }
            })
        }
    }

    function showButtons(zone, input) {
        input = parseInt(input);
        let buttons = "";
        if(zone == "ENTRANCE") {
            buttons = `<button class="btn btn-info move-vehicle" data-to="1" title="Move vehicle"><i class="fa fa-car"></i> A</button>
            <button class="btn btn-warning move-vehicle" data-to="2" title="Move vehicle"><i class="fa fa-car"></i> B</button>`;
        } else {
            input = input == 1 ? input++ : input;
            input += 1;
            buttons = `<button class="btn btn-info move-vehicle" data-to="${input}" title="Move vehicle"><i class="fa fa-car"></i></button>`
        }

        return buttons;
    }

});