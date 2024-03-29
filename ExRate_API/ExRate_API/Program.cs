using ExRate_API.Configs;
using ExRate_API.DataFromService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
            builder.WithOrigins("http://localhost:8080")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == null)
{
    builder.Services.AddSingleton<IGetExRateForecast, GetExRateForecastLocally>();
}
else
{
    builder.Services.AddSingleton<IGetExRateForecast, GetExRateForecastInContainer>();
}

builder.Services.Configure<LocalConfig>(builder.Configuration.GetSection("LocalConfig"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowAllOrigins");

app.MapControllers();

app.Run();