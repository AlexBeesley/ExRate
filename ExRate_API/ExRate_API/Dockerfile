#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

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