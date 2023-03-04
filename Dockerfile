# Start with a base image that includes Python and .NET Core runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
RUN apt-get update && apt-get install -y python3-pip

# Set the working directory
WORKDIR /app

# Copy the Python solution into the container
COPY ExRate_Service /app/ExRate_Service

# Install the Python dependencies
RUN pip3 install -r ExRate_Service/requirements.txt

# Copy the .NET API into the container
COPY ExRate_API /app/ExRate_API

# Build the .NET API
RUN cd ExRate_API
EXPOSE 8000
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["ExRate_API/ExRate_API.csproj", "ExRate_API/"]
RUN dotnet restore "ExRate_API/ExRate_API.csproj"
COPY . .
WORKDIR "/src/ExRate_API"
RUN dotnet build "ExRate_API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ExRate_API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ExRate_API.dll"]

